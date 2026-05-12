// ─── User Model (Sequelize) ───
// Table: users
// Columns: id, email, password (bcrypt hash), name, role, hallId, active, lastLoginAt, mustChangePassword, createdAt, updatedAt

const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        // Normalize email to lowercase + trimmed
        this.setDataValue("email", String(value || "").toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // No exposing in toJSON — see toSafeJSON below
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue("name", String(value || "").trim());
      },
    },
    role: {
      type: DataTypes.ENUM("owner", "manager", "cashier"),
      allowNull: false,
      defaultValue: "manager",
    },
    hallId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,  // createdAt + updatedAt
    indexes: [
      { unique: true, fields: ["email"] },
      { fields: ["role"] },
    ],
  }
);

// Hash password before saving (only if it's been modified)
User.beforeSave(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Compare a plain password against the stored hash
User.prototype.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Return user object without password (for API responses)
User.prototype.toSafeJSON = function () {
  const obj = this.toJSON();
  delete obj.password;
  return obj;
};

module.exports = User;
