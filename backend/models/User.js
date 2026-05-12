// ─── User Model ───
// Stores: email, password (bcrypt-hashed), role, hallId, active flag
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },  // bcrypt hash, NEVER plain text
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["owner", "manager", "cashier"],
      default: "manager",
    },
    hallId: { type: String, default: null },   // For managers locked to a specific hall
    active: { type: Boolean, default: true },  // Owner can disable accounts
    lastLoginAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    mustChangePassword: { type: Boolean, default: false },  // Force password change on next login
  },
  { timestamps: true }
);

// Hash password before saving (only if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);  // Cost factor 12 = good balance of security & speed
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare a plain password against the stored hash
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Convert to JSON without exposing the password hash
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
