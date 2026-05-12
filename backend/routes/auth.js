// ─── Auth Routes (Sequelize version) ───
const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { Op } = require("sequelize");
const User = require("../models/User");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// Rate limiter for login: max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password changes
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts. Please try again later." },
});

// ─── POST /api/auth/login ───
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.active) return res.status(403).json({ error: "Account disabled. Contact the Owner." });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ─── GET /api/auth/me ───
router.get("/me", requireAuth, async (req, res) => {
  res.json(req.user.toSafeJSON());
});

// ─── POST /api/auth/change-password ───
router.post("/change-password", requireAuth, sensitiveLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const ok = await req.user.comparePassword(currentPassword);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect" });

    req.user.password = newPassword;
    req.user.mustChangePassword = false;
    await req.user.save();

    res.json({ ok: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// ─── POST /api/auth/update-profile ───
router.post("/update-profile", requireAuth, sensitiveLimiter, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (name && name.trim()) req.user.name = name.trim();
    if (email && email.trim()) {
      const newEmail = String(email).toLowerCase().trim();
      // Check uniqueness (excluding current user)
      const exists = await User.findOne({
        where: { email: newEmail, id: { [Op.ne]: req.user.id } },
      });
      if (exists) return res.status(400).json({ error: "That email is already in use" });
      req.user.email = newEmail;
    }
    await req.user.save();
    res.json({ ok: true, user: req.user.toSafeJSON() });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
