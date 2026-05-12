// ─── App Data Routes ───
// The frontend stores everything (bookings, halls, customers, etc.) as one big JSON object.
// We store that whole object server-side, with version stamps so multiple devices stay in sync.
const express = require("express");
const AppData = require("../models/AppData");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ─── GET /api/data — fetch the current app data ───
router.get("/", async (req, res) => {
  try {
    let doc = await AppData.findOne({}).sort({ createdAt: 1 });
    if (!doc) {
      // First time — create an empty document
      doc = await AppData.create({ data: {}, version: 0 });
    }
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
    const doc = await AppData.findOne({}).sort({ createdAt: 1 }).select("version lastModifiedAt");
    if (!doc) return res.json({ version: 0 });
    res.json({ version: doc.version, lastModifiedAt: doc.lastModifiedAt });
  } catch (err) {
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

    let doc = await AppData.findOne({}).sort({ createdAt: 1 });
    if (!doc) doc = new AppData();

    // Optional optimistic locking: if frontend says expectedVersion, check it matches
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
