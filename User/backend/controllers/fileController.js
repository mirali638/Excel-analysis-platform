const File = require("../models/File");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require('path');
const logActivity = require("../utils/LogActivity");

// Helper function to get the uploads directory path
const getUploadsDir = () => path.join(__dirname, '..', 'uploads');

async function processFile(filePath, fileType) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Get row count
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    const rowCount = jsonData.length;

    return {
      success: true,
      metadata: {
        rowCount,
        fileType,
        lastModified: new Date()
      }
    };
  } catch (error) {
    console.error("Error processing file:", error);
    return { success: false, error: error.message };
  }
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);

    // Process the file and get metadata
    const processResult = await processFile(filePath, fileType);

    if (!processResult.success) {
      return res.status(500).json({ error: "File processing failed" });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.filename,
      size: req.file.size,
      uploadedBy: req.user.id,
      rowCount: processResult.metadata.rowCount,
      status: "processed",
      fileType: fileType,
      metadata: processResult.metadata
    });

    await newFile.save();

    // Log user activity
    const user = req.user;
    await logActivity({
      userId: user.id,
      username: user.name || user.email,
      action: "File Upload",
      details: `Uploaded ${fileType.toUpperCase()} file: ${req.file.originalname}`,
    });

    res.status(201).json({
      message: "File uploaded and processed",
      file: newFile,
    });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ error: "File upload failed" });
  }
};

exports.getMyUploads = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const uploads = await File.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ uploads });
  } catch (err) {
    console.error("Fetch my uploads error:", err);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findOne({ _id: fileId, uploadedBy: req.user.id });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(getUploadsDir(), file.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ error: "Error streaming file" });
    });
    fileStream.pipe(res);

  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
};