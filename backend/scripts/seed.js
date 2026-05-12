// ─── Optional seed script: create the 4 default users ───
// Run with:  npm run seed
//
// Creates: owner, mashal manager, deewa manager, cashier
// Safe to run multiple times — won't duplicate existing users.

require("dotenv").config();
const sequelize = require("../db");
const User = require("../models/User");

const DEFAULT_USERS = [
  { email: "owner@jalalkhan.com",   password: "owner123",   name: "Owner",     role: "owner",   hallId: null },
  { email: "mashal@jalalkhan.com",  password: "mashal123",  name: "Manager 1", role: "manager", hallId: null },
  { email: "deewa@jalalkhan.com",   password: "deewa123",   name: "Manager 2", role: "manager", hallId: null },
  { email: "cashier@jalalkhan.com", password: "cashier123", name: "Cashier",   role: "cashier", hallId: null },
];

async function main() {
  console.log("");
  console.log("Connecting to MySQL...");
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    for (const userData of DEFAULT_USERS) {
      const exists = await User.findOne({ where: { email: userData.email } });
      if (exists) {
        console.log(`  ⏭  Skipped (already exists): ${userData.email}`);
      } else {
        await User.create({ ...userData, active: true, mustChangePassword: true });
        console.log(`  ✓ Created: ${userData.email} / ${userData.password}`);
      }
    }

    console.log("");
    console.log("✓ Seed complete. Default users are ready.");
    console.log("⚠ Each user must change their password on first login.");
    console.log("");

    await sequelize.close();
  } catch (err) {
    console.error("✗ Seed failed:", err.message);
    await sequelize.close();
    process.exit(1);
  }
}

main();
