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
const path = require("path");
const fs = require("fs");

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
        $match: { chartType: { $ne: null } },
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

// Excel files management
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
    const file = await File.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .lean();

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const formattedFile = {
      ...file,
      uploadedBy: file.uploadedBy ? {
        name: file.uploadedBy.name || 'Unknown',
        email: file.uploadedBy.email
      } : { name: 'Unknown', email: 'N/A' },
      metadata: file.metadata || {
        rowCount: file.rowCount || 0,
        fileType: file.fileType || 'Unknown',
        lastModified: file.updatedAt || file.createdAt
      }
    };

    res.json(formattedFile);
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

// Download file
router.get("/files/:id/download", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      res.status(500).json({ message: "Error streaming file" });
    });
    fileStream.pipe(res);

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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
