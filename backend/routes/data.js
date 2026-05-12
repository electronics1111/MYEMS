// ─── App Data Routes (Sequelize) ───
// Stores the entire app state as a single row with a JSON column.
// Version stamp lets multiple devices sync.
const express = require("express");
const AppData = require("../models/AppData");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Helper to fetch or create the singleton row
async function getOrCreateAppData() {
  let doc = await AppData.findOne({ order: [["createdAt", "ASC"]] });
  if (!doc) doc = await AppData.create({ data: {}, version: 0 });
  return doc;
}

// ─── GET /api/data — fetch the current app data ───
router.get("/", async (req, res) => {
  try {
    const doc = await getOrCreateAppData();
    res.json({
      data: doc.data,
      version: doc.version,
      lastModifiedBy: doc.lastModifiedBy,
      lastModifiedAt: doc.lastModifiedAt,
    });
  } catch (err) {
    console.error("Get data error:", err);
    res.status(500).json({ error: "Failed to load data" });
  }
});

// ─── GET /api/data/version — just the version number (used for polling) ───
router.get("/version", async (req, res) => {
  try {
    const doc = await AppData.findOne({
      order: [["createdAt", "ASC"]],
      attributes: ["version", "lastModifiedAt"],
    });
    if (!doc) return res.json({ version: 0 });
    res.json({ version: doc.version, lastModifiedAt: doc.lastModifiedAt });
  } catch (err) {
    console.error("Get version error:", err);
    res.status(500).json({ error: "Failed to fetch version" });
  }
});

// ─── POST /api/data — save the app data ───
router.post("/", async (req, res) => {
  try {
    const { data, expectedVersion } = req.body;
    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Invalid data payload" });
    }

    const doc = await getOrCreateAppData();

    // Optional optimistic locking
    if (typeof expectedVersion === "number" && expectedVersion !== doc.version) {
      return res.status(409).json({
        error: "Data was changed elsewhere. Please reload.",
        currentVersion: doc.version,
      });
    }

    doc.data = data;
    doc.version = (doc.version || 0) + 1;
    doc.lastModifiedBy = req.user.email;
    doc.lastModifiedAt = new Date();
    await doc.save();

    res.json({ version: doc.version, lastModifiedAt: doc.lastModifiedAt });
  } catch (err) {
    console.error("Save data error:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

module.exports = router;
