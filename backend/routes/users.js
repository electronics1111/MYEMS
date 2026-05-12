// ─── User Management Routes (Sequelize, Owner only) ───
const express = require("express");
const { Op } = require("sequelize");
const User = require("../models/User");
const { requireAuth, requireOwner } = require("../middleware/auth");

const router = express.Router();

// All routes here require auth + owner role
router.use(requireAuth, requireOwner);

// ─── GET /api/users — list all users ───
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(users.map((u) => u.toSafeJSON()));
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ error: "Failed to list users" });
  }
});

// ─── POST /api/users — create a new user ───
router.post("/", async (req, res) => {
  try {
    const { email, password, name, role, hallId, mustChangePassword } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Email, password, name, and role are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (!["owner", "manager", "cashier"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const exists = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
    if (exists) return res.status(400).json({ error: "A user with that email already exists" });

    const user = await User.create({
      email: String(email).toLowerCase().trim(),
      password,           // beforeSave hook will hash this
      name: String(name).trim(),
      role,
      hallId: hallId || null,
      mustChangePassword: !!mustChangePassword,
    });

    res.status(201).json(user.toSafeJSON());
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ─── PATCH /api/users/:id — update user details ───
router.patch("/:id", async (req, res) => {
  try {
    const { name, email, role, hallId, active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name !== undefined) user.name = String(name).trim();
    if (email !== undefined) {
      const newEmail = String(email).toLowerCase().trim();
      const conflict = await User.findOne({
        where: { email: newEmail, id: { [Op.ne]: user.id } },
      });
      if (conflict) return res.status(400).json({ error: "That email is already in use" });
      user.email = newEmail;
    }
    if (role !== undefined) {
      if (!["owner", "manager", "cashier"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      user.role = role;
    }
    if (hallId !== undefined) user.hallId = hallId || null;
    if (active !== undefined) user.active = !!active;

    await user.save();
    res.json(user.toSafeJSON());
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ─── POST/PUT /api/users/:id/reset-password — owner resets user's password ───
const resetPasswordHandler = async (req, res) => {
  try {
    const { newPassword, mustChangePassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = newPassword;
    user.mustChangePassword = !!mustChangePassword;
    await user.save();
    res.json({ ok: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
router.post("/:id/reset-password", resetPasswordHandler);
router.put("/:id/reset-password", resetPasswordHandler);

// ─── DELETE /api/users/:id — delete a user ───
router.delete("/:id", async (req, res) => {
  try {
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
