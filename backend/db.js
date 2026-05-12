// ─── Database connection (Sequelize + MySQL) ───
// This file initializes the Sequelize instance used by all models.
// It supports both DATABASE_URL (production) and individual DB_HOST/DB_USER/etc (local dev).

const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // Production-style connection string (Railway, PlanetScale, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  // Local development — individual settings
  sequelize = new Sequelize(
    process.env.DB_NAME || "wedding_hall_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      dialect: "mysql",
      logging: false,  // set to console.log to see SQL queries
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    }
  );
}

module.exports = sequelize;
