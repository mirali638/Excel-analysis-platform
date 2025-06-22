// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const File = require("../models/File");
const Chart = require("../models/Charts");
const LogActivity = require("../models/LogActivity");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userControllers");
const {
  authenticateJWT,
  authorizeRole,
} = require("../middlewares/authMiddleware");
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const filesProcessed = await File.countDocuments();

    const storageUsedInBytes = await File.aggregate([
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);
    const storageUsed = storageUsedInBytes.length
      ? (storageUsedInBytes[0].totalSize / 1024 ** 3).toFixed(2) + " GB"
      : "0 GB";

    const recentActivity = await File.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("filename createdAt")
      .lean();

    const activityMapped = recentActivity.map((file) => ({
      type: "upload",
      description: `File uploaded: ${file.filename}`,
      time: new Date(file.createdAt).toLocaleString(),
    }));

    const totalCharts = await Chart.countDocuments();
    const chartTypesCount = await Chart.aggregate([
      {
        $match: { chartType: { $ne: null } }, // exclude null or missing chartType
      },
      {
        $group: {
          _id: "$chartType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalUsers,
      activeUsers,
      filesProcessed,
      storageUsed,
      recentActivity: activityMapped,
      totalCharts,
      chartTypesCount,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User Management Routes
router.get("/", authenticateJWT, authorizeRole(["admin"]), getAllUsers);
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), updateUser);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), deleteUser);
router.put(
  "/:id/status",
  authenticateJWT,
  authorizeRole(["admin"]),
  toggleUserStatus
);
//excel files management
router.get("/files", async (req, res) => {
  try {
    const files = await File.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email");
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

// Get single file metadata
router.get("/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: "Error fetching file details" });
  }
});

// Delete file
router.delete("/files/:id", async (req, res) => {
  try {
    const deletedFile = await File.findByIdAndDelete(req.params.id);
    if (!deletedFile)
      return res.status(404).json({ message: "File not found" });
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file" });
  }
});

// Download file (assuming file stored locally or with a URL)
router.get("/files/:id/download", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // If you have file path:
    res.download(file.filePath, file.originalName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        // Check if headers have already been sent
        if (!res.headersSent) {
          res.status(500).json({ message: "Error downloading file" });
        }
      }
    });

    // Or if file URL:
    // res.redirect(file.fileUrl);

    // For now, simulate with JSON:
    // res.json({ message: `Download logic for file ${file.fileName} here` });
  } catch (error) {
    res.status(500).json({ message: "Error downloading file" });
  }
});
router.get("/charts", async (req, res) => {
  try {
    console.log("📊 Fetching charts with allowDiskUse...");

    const charts = await Chart.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
    ]).allowDiskUse(true); // ✅ Correct method in Mongoose

    console.log("✅ Charts fetched:", charts.length);
    res.json(charts);
  } catch (err) {
    console.error("❌ Error in /charts route:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//activity logs

router.get("/logs", authenticateJWT, async (req, res) => {
  try {
    const logs = await LogActivity.find().sort({ createdAt: -1 });

    const formattedLogs = logs.map((log) => ({
      id: log._id,
      action: log.action,
      username: log.username,
      details: log.details,
      timestamp: log.timestamp,
    }));

    res.status(200).json(formattedLogs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
