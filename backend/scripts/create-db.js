// ─── Create the MySQL database (if it doesn't exist) ───
// Run this once before the first start:  npm run create-db
//
// Connects to MySQL WITHOUT specifying a database, creates the database,
// then disconnects. The main app will create the tables on first run via sequelize.sync().

require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  const dbName = process.env.DB_NAME || "wedding_hall_db";
  const host = process.env.DB_HOST || "localhost";
  const port = parseInt(process.env.DB_PORT || "3306", 10);
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";

  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  CREATE DATABASE");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Host:     ${host}:${port}`);
  console.log(`User:     ${user}`);
  console.log(`Database: ${dbName}`);
  console.log("");

  let connection;
  try {
    connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Database "${dbName}" is ready.`);
    console.log("");
    console.log("Next steps:");
    console.log("  1. npm run create-owner    (create the first owner account)");
    console.log("  2. npm start                (start the server)");
    console.log("");
  } catch (err) {
    console.error("✗ Failed to create database:", err.message);
    console.error("");
    console.error("Common fixes:");
    console.error("  • Make sure MySQL is running");
    console.error("  • Verify DB_USER and DB_PASSWORD in .env");
    console.error("  • If using XAMPP/WAMP, start the MySQL service first");
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

main();
