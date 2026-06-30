const { HttpError } = require("../utils/httpError");

// Patterns that indicate database connection issues
const DB_CONNECTION_PATTERNS = [
  "Can't reach database server",
  "P1001",
  "P1002",
  "Connection refused",
  "ECONNREFUSED",
  "prisma.",
  "query failed",
  "timed out"
];

// Patterns that indicate internal errors we should hide
const SENSITIVE_PATTERNS = [
  "passwordHash",
  "bcrypt",
  "jwt",
  "token",
  "secret",
  "stack",
  "at prisma"
];

const isDbConnectionError = (err) => {
  const msg = err.message || "";
  return DB_CONNECTION_PATTERNS.some(p => msg.includes(p));
};

const sanitizeError = (err) => {
  let message = err.message || "Internal server error";
  
  // If it's a DB connection error, return generic message
  if (isDbConnectionError(err)) {
    return "Database service temporarily unavailable";
  }
  
  // In production, hide internal details
  if (process.env.NODE_ENV === "production") {
    // Check if message contains sensitive patterns
    const hasSensitive = SENSITIVE_PATTERNS.some(p => message.toLowerCase().includes(p.toLowerCase()));
    if (hasSensitive || message.includes("prisma") || message.includes("at ")) {
      return "Internal server error";
    }
  }
  
  return message;
};

const errorHandler = (err, req, res, next) => {
  console.error("[Error Handler]", {
    name: err.name,
    message: err.message,
    code: err.code,
    path: req.path,
    method: req.method
  });

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Prisma errors
  if (err.code && err.code.startsWith("P")) {
    if (isDbConnectionError(err)) {
      return res.status(503).json({ 
        message: "Database service temporarily unavailable",
        code: "DB_UNAVAILABLE"
      });
    }
    return res.status(400).json({ 
      message: sanitizeError(err),
      code: err.code
    });
  }

  return res.status(500).json({
    message: sanitizeError(err)
  });
};

module.exports = { errorHandler };
