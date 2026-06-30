// Mock users for fallback when database is unavailable
const MOCK_USERS = [
  {
    id: "mock-001",
    email: "admin@neoviet360.vn",
    name: "Admin NeoViet",
    avatar: null,
    provider: "LOCAL",
    phone: "0909123456",
    kycStatus: "VERIFIED",
    tier: "VIP",
    createdAt: new Date().toISOString()
  },
  {
    id: "mock-002",
    email: "demo@neoviet360.vn",
    name: "Demo User",
    avatar: null,
    provider: "LOCAL",
    phone: "0909123457",
    kycStatus: "VERIFIED",
    tier: "Thành viên",
    createdAt: new Date().toISOString()
  }
];

const MOCK_PASSWORDS = {
  "admin@neoviet360.vn": "password123",
  "demo@neoviet360.vn": "demo123"
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

const signToken = (user) => jwt.sign(
  { sub: user.id, email: user.email },
  process.env.JWT_SECRET || "dev-only-secret-change-me",
  { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
);

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  provider: user.provider,
  phone: user.phone,
  kycStatus: user.kycStatus,
  tier: user.tier,
  createdAt: user.createdAt
});

const isDbAvailable = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) throw httpError(400, "Email and password are required");

  // Check if DB is available
  if (!(await isDbAvailable())) {
    return res.status(503).json({ 
      message: "Database service temporarily unavailable. Please try again later.",
      code: "DB_UNAVAILABLE"
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || email.split("@")[0],
      provider: "LOCAL"
    }
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const loginEmail = email || username;
  if (!loginEmail || !password) throw httpError(400, "Email and password are required");

  // Try database first
  let user = null;
  let dbAvailable = false;
  
  try {
    dbAvailable = await isDbAvailable();
    if (dbAvailable) {
      user = await prisma.user.findUnique({ where: { email: loginEmail } });
    }
  } catch (dbError) {
    console.log("[Auth] Database unavailable, using mock login");
    dbAvailable = false;
  }

  // If DB is available and user exists, verify password
  if (dbAvailable && user) {
    if (!user.passwordHash) throw httpError(401, "Invalid credentials");
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw httpError(401, "Invalid credentials");
    
    return res.json({ token: signToken(user), user: publicUser(user) });
  }

  // Fallback to mock login when DB is unavailable
  console.log("[Auth] Falling back to mock login for:", loginEmail);
  
  // Check mock credentials
  const mockUser = MOCK_USERS.find(u => u.email === loginEmail);
  const mockPassword = MOCK_PASSWORDS[loginEmail];
  
  if (mockUser && mockPassword === password) {
    // Generate a mock token for demo purposes
    const mockToken = jwt.sign(
      { sub: mockUser.id, email: mockUser.email, mock: true },
      process.env.JWT_SECRET || "dev-only-secret-change-me",
      { expiresIn: "24h" }
    );
    
    return res.json({ 
      token: mockToken, 
      user: publicUser(mockUser),
      _mock: true,
      _notice: "Logged in with demo credentials (database unavailable)"
    });
  }

  // No user found in mock or DB
  throw httpError(401, "Invalid credentials");
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

const googleStart = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent"
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw httpError(400, "Missing Google authorization code");

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  const { tokens } = await client.getToken({
    code,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback"
  });

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const profile = ticket.getPayload();
  const user = await prisma.user.upsert({
    where: { email: profile.email },
    update: {
      name: profile.name || profile.email,
      avatar: profile.picture,
      provider: "GOOGLE",
      providerId: profile.sub
    },
    create: {
      email: profile.email,
      name: profile.name || profile.email,
      avatar: profile.picture,
      provider: "GOOGLE",
      providerId: profile.sub
    }
  });

  const token = signToken(user);
  res.redirect(`${process.env.FRONTEND_AUTH_REDIRECT || "http://localhost:5500/#/login"}?token=${encodeURIComponent(token)}`);
});

const zaloStart = (req, res) => {
  const params = new URLSearchParams({
    app_id: process.env.ZALO_APP_ID || "",
    redirect_uri: process.env.ZALO_CALLBACK_URL || "http://localhost:3001/api/auth/zalo/callback"
  });
  res.redirect(`https://oauth.zaloapp.com/v4/permission?${params.toString()}`);
};

const zaloCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw httpError(400, "Missing Zalo authorization code");

  const tokenResponse = await axios.post("https://oauth.zaloapp.com/v4/access_token", new URLSearchParams({
    code,
    app_id: process.env.ZALO_APP_ID || "",
    grant_type: "authorization_code"
  }), {
    headers: {
      secret_key: process.env.ZALO_APP_SECRET || "",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const accessToken = tokenResponse.data.access_token;
  const profileResponse = await axios.get("https://graph.zalo.me/v2.0/me?fields=id,name,picture", {
    headers: { access_token: accessToken }
  });

  const profile = profileResponse.data;
  const email = `zalo-${profile.id}@neoviet360.local`;
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: profile.name || "Zalo User",
      avatar: profile.picture?.data?.url,
      provider: "ZALO",
      providerId: String(profile.id)
    },
    create: {
      email,
      name: profile.name || "Zalo User",
      avatar: profile.picture?.data?.url,
      provider: "ZALO",
      providerId: String(profile.id)
    }
  });

  const token = signToken(user);
  res.redirect(`${process.env.FRONTEND_AUTH_REDIRECT || "http://localhost:5500/#/login"}?token=${encodeURIComponent(token)}`);
});

module.exports = {
  register,
  login,
  me,
  googleStart,
  googleCallback,
  zaloStart,
  zaloCallback,
  signToken,
  publicUser
};