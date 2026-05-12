// ═══════════════════════════════════════════════════════════════════════
// JALAL KHAN WEDDING HALL MANAGEMENT — BACKEND SERVER
// ═══════════════════════════════════════════════════════════════════════
// Express + MongoDB + JWT authentication
//
// Quick start:
//   1. cp .env.example .env  (and fill in MONGO_URI + JWT_SECRET)
//   2. npm install
//   3. npm run create-owner  (creates the first owner account)
//   4. npm start             (or npm run dev for auto-reload)
// ═══════════════════════════════════════════════════════════════════════

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const dataRoutes = require("./routes/data");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/wedding-hall-db";

// ─── Middleware ───
app.use(cors());                       // Allow frontend to call this API
app.use(express.json({ limit: "10mb" })); // Parse JSON requests (large limit for backup imports)

// ─── Health check (the frontend pings this to detect cloud mode) ───
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Jalal Khan Wedding Hall API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);

// ─── 404 fallback ───
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ───
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ─── Connect to MongoDB, then start server ───
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✓ MongoDB connected:", MONGO_URI.replace(/\/\/[^@]+@/, "//***:***@"));
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  });
