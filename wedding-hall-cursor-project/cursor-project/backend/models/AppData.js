// ─── AppData Model ───
// Single document that stores ALL application data (bookings, customers, halls, etc.)
// We use a "single document" approach because the frontend already manages everything
// as one big JSON object in localStorage. This keeps the API simple and reliable.
//
// Version is incremented on every save, so the frontend can detect when another user
// has saved changes and refresh.
const mongoose = require("mongoose");

const appDataSchema = new mongoose.Schema(
  {
    // The main payload — contains halls, bookings, customers, expenses, etc.
    // Stored as Mixed because schema is dynamic and managed by the frontend.
    data: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Incremented on every save — used by the frontend to detect updates from other devices
    version: { type: Number, default: 0 },

    // Who saved this version
    lastModifiedBy: { type: String, default: null },
    lastModifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppData", appDataSchema);
