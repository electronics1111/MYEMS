// ─── JWT Authentication Middleware (Sequelize version) ───
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Verifies the JWT token in the Authorization header and attaches `req.user`
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.active) return res.status(403).json({ error: "Account disabled. Contact the Owner." });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ error: "Session expired. Please log in again." });
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Only allows owners through
function requireOwner(req, res, next) {
  if (!req.user || req.user.role !== "owner") {
    return res.status(403).json({ error: "Owner access required" });
  }
  next();
}

module.exports = { requireAuth, requireOwner, JWT_SECRET };
