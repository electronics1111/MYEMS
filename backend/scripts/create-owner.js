// ─── Bootstrap script: create the initial Owner account ───
// Run this once after setting up your database:  npm run create-owner
//
// Uses INITIAL_OWNER_EMAIL / INITIAL_OWNER_PASSWORD from .env

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function main() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/wedding-hall-db";
  const EMAIL = (process.env.INITIAL_OWNER_EMAIL || "owner@jalalkhan.com").toLowerCase();
  const PASSWORD = process.env.INITIAL_OWNER_PASSWORD || "changeme123";
  const NAME = process.env.INITIAL_OWNER_NAME || "Owner";

  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  CREATE INITIAL OWNER ACCOUNT");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");

  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email: EMAIL });
  if (existing) {
    console.log(`✗ User with email "${EMAIL}" already exists. No changes made.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const user = new User({
    email: EMAIL,
    password: PASSWORD,    // pre-save hook will bcrypt-hash this
    name: NAME,
    role: "owner",
    active: true,
    mustChangePassword: true,  // Force change on first login
  });
  await user.save();

  console.log("✓ Owner account created successfully:");
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log("");
  console.log("⚠ IMPORTANT: log in and change this password immediately.");
  console.log("");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("✗ Failed:", err.message);
  process.exit(1);
});
