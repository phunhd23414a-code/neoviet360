require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const accountsRoutes = require("./routes/accounts.routes");
const transactionsRoutes = require("./routes/transactions.routes");
const transferRoutes = require("./routes/transfer.routes");
const featuresRoutes = require("./routes/features.routes");
const externalRoutes = require("./routes/external.routes");
const paymentRoutes = require("./routes/payment.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Parse allowed origins from env var - support multiple origins for different deployments
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5500,http://127.0.0.1:5500")
  .split(",")
  .map((origin) => origin.trim());

// Additional trusted origins for production deployments
const trustedOrigins = (process.env.TRUSTED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allAllowedOrigins = [...new Set([...allowedOrigins, ...trustedOrigins])];
const isTrustedVercelOrigin = (origin) =>
  /^https:\/\/neoviet360(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

// CORS configuration - secure by default
app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development or if explicitly configured
    if (process.env.NODE_ENV !== "production" || process.env.ALLOW_ALL_ORIGINS === "true") {
      return callback(null, true);
    }
    
    // Check against allowed list
    if (allAllowedOrigins.includes(origin) || isTrustedVercelOrigin(origin)) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Handle preflight OPTIONS requests
app.options("*", cors());

app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "neoviet360-backend",
    message: "NeoViet360 backend API is running",
    docs: "See /health and /api/* endpoints",
    environment: process.env.NODE_ENV || "development",
    endpoints: [
      "/health",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/me",
      "/api/accounts",
      "/api/transactions",
      "/api/transfer",
      "/api/budgets",
      "/api/savings",
      "/api/loans",
      "/api/cards",
      "/api/bills",
      "/api/split-bills",
      "/api/rewards",
      "/api/notifications",
      "/api/fx-rates",
      "/api/crypto",
      "/api/chat",
      "/api/carbon",
      "/api/payment/topups",
      "/api/payment/ewallet",
      "/api/payment/qrpay",
      "/api/payment/scheduled"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "neoviet360-backend",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api", featuresRoutes);
app.use("/api", externalRoutes);
app.use("/api/payment", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;