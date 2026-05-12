// ─── Owner password reset script ───
// Use this if the Owner forgets their password.
// Usage:  npm run reset-owner-password
//
// You'll be prompted for a new password.

require("dotenv").config();
const readline = require("readline");
const sequelize = require("../db");
const User = require("../models/User");

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

async function main() {
  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  OWNER PASSWORD RESET");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");

  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const owner = await User.findOne({ where: { role: "owner" } });
    if (!owner) {
      console.log("✗ No owner account found. Run `npm run create-owner` first.");
      await sequelize.close();
      process.exit(1);
    }

    console.log("Found owner account:");
    console.log(`  Name:  ${owner.name}`);
    console.log(`  Email: ${owner.email}`);
    console.log("");

    const newPassword = await ask("Enter new password (min 6 chars): ");
    if (!newPassword || newPassword.length < 6) {
      console.log("✗ Password must be at least 6 characters.");
      await sequelize.close();
      process.exit(1);
    }

    const confirm = await ask("Confirm new password: ");
    if (newPassword !== confirm) {
      console.log("✗ Passwords do not match.");
      await sequelize.close();
      process.exit(1);
    }

    owner.password = newPassword;  // beforeSave hook will bcrypt-hash it
    await owner.save();

    console.log("");
    console.log("✓ Owner password reset successfully.");
    console.log("");

    await sequelize.close();
  } catch (err) {
    console.error("✗ Failed:", err.message);
    await sequelize.close();
    process.exit(1);
  }
}

main();
