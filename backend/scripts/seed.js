// ─── Optional seed script: create the 4 default users ───
// Run with:  npm run seed
//
// Creates: owner, mashal manager, deewa manager, cashier
// Safe to run multiple times — won't duplicate existing users.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const DEFAULT_USERS = [
  { email: "owner@jalalkhan.com",   password: "owner123",   name: "Owner",     role: "owner",   hallId: null },
  { email: "mashal@jalalkhan.com",  password: "mashal123",  name: "Manager 1", role: "manager", hallId: null },
  { email: "deewa@jalalkhan.com",   password: "deewa123",   name: "Manager 2", role: "manager", hallId: null },
  { email: "cashier@jalalkhan.com", password: "cashier123", name: "Cashier",   role: "cashier", hallId: null },
];

async function main() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/wedding-hall-db";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);

  for (const userData of DEFAULT_USERS) {
    const exists = await User.findOne({ email: userData.email });
    if (exists) {
      console.log(`  ⏭  Skipped (already exists): ${userData.email}`);
    } else {
      const user = new User({ ...userData, active: true, mustChangePassword: true });
      await user.save();
      console.log(`  ✓ Created: ${userData.email} / ${userData.password}`);
    }
  }

  console.log("");
  console.log("✓ Seed complete. Default users are ready.");
  console.log("⚠ Each user must change their password on first login.");
  console.log("");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message);
  process.exit(1);
});
