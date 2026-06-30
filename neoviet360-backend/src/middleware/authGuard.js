const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { httpError } = require("../utils/httpError");

const authGuard = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw httpError(401, "Missing bearer token");

  const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-only-secret-change-me");
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) throw httpError(401, "User no longer exists");

  req.user = user;
  req.userId = user.id;
  next();
});

module.exports = authGuard;