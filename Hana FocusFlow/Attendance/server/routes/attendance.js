const express = require("express");
const Attendance = require("../models/Attendance");
const admin = require("../firebaseAdmin"); // Firebase Admin SDK
const router = express.Router();
const auth = require("../middleware/auth");

// POST /api/attendance — Mark attendance
router.post("/", auth, async (req, res) => {
  const { present, note } = req.body;
  const userId = req.user.uid;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  try {
    const record = await Attendance.findOneAndUpdate(
      { userId, date: today },
      { $set: { present, note, markedAt: new Date() } },
      { upsert: true, new: true }
    );

    // Send notification to admin (optional)
    const adminToken = "ADMIN_FCM_TOKEN"; // Replace with token from DB or env
    if (adminToken) {
      await admin.messaging().send({
        notification: {
          title: "New Attendance Marked",
          body: `${req.user.email} marked as ${present ? "Present" : "Absent"}`
        },
        token: adminToken
      });
    }

    res.json({ success: true, data: record });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

// GET /api/attendance/logs — Get user’s attendance logs
router.get("/logs", auth, async (req, res) => {
  try {
    const logs = await Attendance.find({ userId: req.user.uid }).sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ success: false, error: "Failed to fetch logs" });
  }
});

// GET /api/attendance/report/:year/:month — Admin report
router.get("/report/:year/:month", auth, async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Admins only" });
  }

  const { year, month } = req.params;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  try {
    const report = await Attendance.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: "$userId",
          presentDays: { $sum: { $cond: ["$present", 1, 0] } },
          totalDays: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, data: report });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ success: false, error: "Failed to generate report" });
  }
});

// backend /api/attendance POST handler

const admin = require("firebase-admin");

app.post("/api/attendance", async (req, res) => {
  try {
    const { present, note } = req.body;
    const user = req.user; // assume you have user info from auth middleware
    // Save attendance data to DB here...

    // Send notification using Firebase Admin SDK
    await admin.messaging().send({
      notification: {
        title: "New Attendance",
        body: `${user.email} marked as ${present ? "Present" : "Absent"}`,
      },
      token: adminToken,  // get the adminToken from DB or config
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// ✅ Important: Export the router
module.exports = router;
