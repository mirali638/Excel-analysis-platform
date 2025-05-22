/* const express = require("express");
const router = express.Router();
const User = require("../models/User");
const File = require("../models/File");
const Chart = require("../models/Charts");




// Mock data for admin module
const mockData = {
  users: [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-03-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-03-15T09:15:00Z",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "user",
      status: "blocked",
      lastLogin: "2024-03-14T16:45:00Z",
    },
  ],
  excelFiles: [
    {
      id: 1,
      fileName: "sales_data_2024.xlsx",
      uploadDate: "2024-03-15T08:00:00Z",
      size: "2.5MB",
      status: "processed",
      uploadedBy: "Alice Smith",
    },
    {
      id: 2,
      fileName: "inventory_report.xlsx",
      uploadDate: "2024-03-14T15:30:00Z",
      size: "1.8MB",
      status: "processing",
      uploadedBy: "Bob Johnson",
    },
  ],
  activityLogs: [
    {
      id: 1,
      action: "File Upload",
      user: "Alice Smith",
      timestamp: "2024-03-15T10:30:00Z",
      details: "Uploaded sales_data_2024.xlsx",
    },
    {
      id: 2,
      action: "User Login",
      user: "Bob Johnson",
      timestamp: "2024-03-15T09:15:00Z",
      details: "Successful login",
    },
  ],
  analytics: {
    totalUsers: 150,
    activeUsers: 120,
    totalFiles: 45,
    processedFiles: 40,
    storageUsed: "2.5GB",
  },
};


// Excel File Management Routes
router.get(
  "/excel-files",
  authenticateJWT,
  authorizeRole(["admin"]),
  (req, res) => {
    // Return list of all uploaded files
    res.json(mockData.excelFiles);
  }
);

router.delete(
  "/excel-files/:id",
  authenticateJWT,
  authorizeRole(["admin"]),
  (req, res) => {
    const { id } = req.params;
    const index = mockData.excelFiles.findIndex(
      (file) => file.id === parseInt(id)
    );

    if (index !== -1) {
      mockData.excelFiles.splice(index, 1);
      res.json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  }
);

router.get(
  "/excel-files/:id/download",
  authenticateJWT,
  authorizeRole(["admin"]),
  (req, res) => {
    const { id } = req.params;
    const file = mockData.excelFiles.find((f) => f.id === parseInt(id));

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // In a real implementation, this would send the actual file
    res.json({ message: "File download initiated", fileName: file.fileName });
  }
);

router.get(
  "/excel-files/:id/metadata",
  authenticateJWT,
  authorizeRole(["admin"]),
  (req, res) => {
    const { id } = req.params;
    const file = mockData.excelFiles.find((f) => f.id === parseInt(id));

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Return detailed file metadata
    res.json({
      ...file,
      metadata: {
        sheets: ["Sheet1", "Sheet2"],
        rowCount: 100,
        columnCount: 10,
        lastModified: new Date().toISOString(),
      },
    });
  }
);

// Activity Logs Routes
router.get("/activity-logs", (req, res) => {
  res.json(mockData.activityLogs);
});

// Analytics Routes
router.get("/analytics", (req, res) => {
  res.json({
    totalUsers: 150,
    activeUsers: 120,
    filesProcessed: 45,
    storageUsed: "2.5GB",
  });
});

// AI Summary Routes
router.get("/ai-summaries", (req, res) => {
  res.json([
    {
      id: 1,
      fileName: "sales_data_2024.xlsx",
      summary:
        "The sales data shows a 15% increase in revenue compared to last quarter...",
      status: "completed",
      confidenceScore: 95,
      generatedAt: "2024-03-15T10:30:00Z",
      processingTime: 45,
      keyInsights: [
        "Revenue increased by 15%",
        "Top performing product: Product X",
        "New market segment showing growth",
      ],
    },
    {
      id: 2,
      fileName: "inventory_report.xlsx",
      summary: "Current inventory levels are optimal with a 5% buffer...",
      status: "processing",
      confidenceScore: 0,
      generatedAt: "2024-03-15T11:00:00Z",
      processingTime: 30,
      keyInsights: [],
    },
  ]);
});

router.post("/ai-summaries/:id/regenerate", (req, res) => {
  const { id } = req.params;
  res.json({
    id: parseInt(id),
    fileName: "sales_data_2024.xlsx",
    summary: "Updated analysis shows a 17% increase in revenue...",
    status: "completed",
    confidenceScore: 97,
    generatedAt: new Date().toISOString(),
    processingTime: 50,
    keyInsights: [
      "Revenue increased by 17%",
      "Top performing product: Product Y",
      "New market segment showing 25% growth",
    ],
  });
});

// Dashboard Routes
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
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
        $group: {
          _id: "$type",
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

module.exports = router;
 */
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
    // res.download(file.filePath);

    // Or if file URL:
    // res.redirect(file.fileUrl);

    // For now, simulate with JSON:
    res.json({ message: `Download logic for file ${file.fileName} here` });
  } catch (error) {
    res.status(500).json({ message: "Error downloading file" });
  }
});

router.get("/charts", async (req, res) => {
  try {
    const charts = await Chart.find(); // or `await prisma.chart.findMany()` for Prisma
    res.json(charts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch charts" });
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
