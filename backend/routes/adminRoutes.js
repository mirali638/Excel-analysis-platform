const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');
const {
  getAllUsers,
  updateUser,
  deleteUser,
  toggleUserStatus
} = require('../controllers/userControllers');

// Mock data for admin module
const mockData = {
  users: [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-03-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-03-15T09:15:00Z"
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "user",
      status: "blocked",
      lastLogin: "2024-03-14T16:45:00Z"
    }
  ],
  excelFiles: [
    {
      id: 1,
      fileName: "sales_data_2024.xlsx",
      uploadDate: "2024-03-15T08:00:00Z",
      size: "2.5MB",
      status: "processed",
      uploadedBy: "Alice Smith"
    },
    {
      id: 2,
      fileName: "inventory_report.xlsx",
      uploadDate: "2024-03-14T15:30:00Z",
      size: "1.8MB",
      status: "processing",
      uploadedBy: "Bob Johnson"
    }
  ],
  activityLogs: [
    {
      id: 1,
      action: "File Upload",
      user: "Alice Smith",
      timestamp: "2024-03-15T10:30:00Z",
      details: "Uploaded sales_data_2024.xlsx"
    },
    {
      id: 2,
      action: "User Login",
      user: "Bob Johnson",
      timestamp: "2024-03-15T09:15:00Z",
      details: "Successful login"
    }
  ],
  analytics: {
    totalUsers: 150,
    activeUsers: 120,
    totalFiles: 45,
    processedFiles: 40,
    storageUsed: "2.5GB"
  }
};

// User Management Routes
router.get('/users', authenticateJWT, authorizeRole(['admin']), getAllUsers);
router.put('/users/:id', authenticateJWT, authorizeRole(['admin']), updateUser);
router.delete('/users/:id', authenticateJWT, authorizeRole(['admin']), deleteUser);
router.put('/users/:id/status', authenticateJWT, authorizeRole(['admin']), toggleUserStatus);

// Excel File Management Routes
router.get('/excel-files', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  // Return list of all uploaded files
  res.json(mockData.excelFiles);
});

router.delete('/excel-files/:id', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  const { id } = req.params;
  const index = mockData.excelFiles.findIndex(file => file.id === parseInt(id));
  
  if (index !== -1) {
    mockData.excelFiles.splice(index, 1);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

router.get('/excel-files/:id/download', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  const { id } = req.params;
  const file = mockData.excelFiles.find(f => f.id === parseInt(id));
  
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // In a real implementation, this would send the actual file
  res.json({ message: 'File download initiated', fileName: file.fileName });
});

router.get('/excel-files/:id/metadata', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  const { id } = req.params;
  const file = mockData.excelFiles.find(f => f.id === parseInt(id));
  
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Return detailed file metadata
  res.json({
    ...file,
    metadata: {
      sheets: ["Sheet1", "Sheet2"],
      rowCount: 100,
      columnCount: 10,
      lastModified: new Date().toISOString()
    }
  });
});

// Activity Logs Routes
router.get('/activity-logs', (req, res) => {
  res.json(mockData.activityLogs);
});

// Analytics Routes
router.get('/analytics', (req, res) => {
  res.json({
    totalUsers: 150,
    activeUsers: 120,
    filesProcessed: 45,
    storageUsed: "2.5GB"
  });
});

// AI Summary Routes
router.get('/ai-summaries', (req, res) => {
  res.json([
    {
      id: 1,
      fileName: "sales_data_2024.xlsx",
      summary: "The sales data shows a 15% increase in revenue compared to last quarter...",
      status: "completed",
      confidenceScore: 95,
      generatedAt: "2024-03-15T10:30:00Z",
      processingTime: 45,
      keyInsights: [
        "Revenue increased by 15%",
        "Top performing product: Product X",
        "New market segment showing growth"
      ]
    },
    {
      id: 2,
      fileName: "inventory_report.xlsx",
      summary: "Current inventory levels are optimal with a 5% buffer...",
      status: "processing",
      confidenceScore: 0,
      generatedAt: "2024-03-15T11:00:00Z",
      processingTime: 30,
      keyInsights: []
    }
  ]);
});

router.post('/ai-summaries/:id/regenerate', (req, res) => {
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
      "New market segment showing 25% growth"
    ]
  });
});

// Dashboard Routes
router.get('/dashboard', (req, res) => {
  res.json({
    totalUsers: 150,
    activeUsers: 120,
    filesProcessed: 45,
    storageUsed: "2.5GB",
    recentActivity: [
      {
        type: "upload",
        description: "New file uploaded: sales_data_2024.xlsx",
        time: "5 minutes ago"
      },
      {
        type: "process",
        description: "File processed: inventory_report.xlsx",
        time: "10 minutes ago"
      },
      {
        type: "user",
        description: "New user registered: John Doe",
        time: "15 minutes ago"
      }
    ]
  });
});

module.exports = router;
