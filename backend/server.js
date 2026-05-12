// ═══════════════════════════════════════════════════════════════════════
// JALAL KHAN WEDDING HALL MANAGEMENT — BACKEND SERVER (MySQL)
// ═══════════════════════════════════════════════════════════════════════
// Express + MySQL (via Sequelize) + JWT authentication
//
// Quick start:
//   1. cp .env.example .env  (and fill in DB_* settings + JWT_SECRET)
//   2. npm install
//   3. npm run create-db          (creates the MySQL database if needed)
//   4. npm run create-owner       (creates the first owner account)
//   5. npm start                  (or npm run dev for auto-reload)
// ═══════════════════════════════════════════════════════════════════════

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./db");
// Import models so Sequelize knows about them (triggers table creation on sync)
require("./models/User");
require("./models/AppData");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const dataRoutes = require("./routes/data");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───
const corsOrigins = (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors(corsOrigins.length > 0 ? { origin: corsOrigins } : {}));
app.use(express.json({ limit: "10mb" }));

// ─── Health check (the frontend pings this to detect cloud mode) ───
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "ok",
      service: "Jalal Khan Wedding Hall API",
      database: "mysql",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "degraded",
      error: "Database unreachable",
      details: err.message,
    });
  }
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

// ─── Connect to MySQL, sync schema, then start server ───
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ MySQL connected");

    // sync() creates tables if they don't exist. Does NOT drop existing data.
    // Use { alter: true } in dev to auto-update column changes.
    // In production, prefer explicit migrations.
    await sequelize.sync();
    console.log("✓ Tables synced");

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("✗ Startup failed:", err.message);
    console.error("");
    console.error("Common fixes:");
    console.error("  • Is MySQL running? Try:  mysql -u root -p");
    console.error("  • Did you create the database? Try:  npm run create-db");
    console.error("  • Check DB_HOST/DB_USER/DB_PASSWORD/DB_NAME in .env");
    process.exit(1);
  }
})();
