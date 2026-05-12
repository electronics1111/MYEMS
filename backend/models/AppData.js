// ─── AppData Model (Sequelize) ───
// Table: app_data — stores the entire application state as a JSON column.
// We use one row only (singleton pattern), incremented on every save.
//
// Why JSON column?
//   The frontend already manages all data as one large JSON object in localStorage.
//   Mirroring that structure server-side keeps the API simple and the frontend untouched.
//   MySQL 5.7+ has native JSON support with indexing capability.

const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const AppData = sequelize.define(
  "AppData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Stores: { halls: [...], bookings: [...], customers: [...], staff: [...], ... }
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    // Incremented on every save — frontend polls this to detect updates from other devices
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastModifiedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    lastModifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "app_data",
    timestamps: true,
  }
);

module.exports = AppData;
