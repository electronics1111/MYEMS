// ─── Bootstrap script: create the initial Owner account ───
// Run this once after setting up your database:  npm run create-owner
//
// Uses INITIAL_OWNER_EMAIL / INITIAL_OWNER_PASSWORD from .env

require("dotenv").config();
const sequelize = require("../db");
const User = require("../models/User");

async function main() {
  const EMAIL = (process.env.INITIAL_OWNER_EMAIL || "owner@jalalkhan.com").toLowerCase();
  const PASSWORD = process.env.INITIAL_OWNER_PASSWORD || "changeme123";
  const NAME = process.env.INITIAL_OWNER_NAME || "Owner";

  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  CREATE INITIAL OWNER ACCOUNT");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");

  try {
    await sequelize.authenticate();
    await sequelize.sync();  // Make sure the users table exists

    const existing = await User.findOne({ where: { email: EMAIL } });
    if (existing) {
      console.log(`✗ User with email "${EMAIL}" already exists. No changes made.`);
      await sequelize.close();
      process.exit(0);
    }

    await User.create({
      email: EMAIL,
      password: PASSWORD,    // beforeSave hook will bcrypt-hash this
      name: NAME,
      role: "owner",
      active: true,
      mustChangePassword: true,
    });

    console.log("✓ Owner account created successfully:");
    console.log(`  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log("");
    console.log("⚠ IMPORTANT: log in and change this password immediately.");
    console.log("");

    await sequelize.close();
  } catch (err) {
    console.error("✗ Failed:", err.message);
    await sequelize.close();
    process.exit(1);
  }
}

main();
