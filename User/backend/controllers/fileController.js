const File = require("../models/File");
const XLSX = require("xlsx");
const fs = require("fs");
const logActivity = require("../utils/LogActivity");

async function processFile(filePath) {
  try {
    // Simulate processing (replace with your logic if needed)
    return { success: true };
  } catch (error) {
    console.error("Error processing file:", error);
    return { success: false };
  }
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Read Excel/CSV
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      defval: "", // default value for empty cells
    });

    const rowCount = jsonData.length;

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: filePath,
      size: req.file.size,
      uploadedBy: req.user.id,
      rowCount: rowCount,
      status: "pending",
    });

    await newFile.save();

    // Log user activity
    const user = req.user;
    await logActivity({
      userId: user.id,
      username: user.name || user.email,
      action: "File Upload",
      details: `Uploaded Excel file: ${req.file.originalname}`,
    });

    // File Processing
    const processResult = await processFile(filePath);

    newFile.status = processResult.success ? "processed" : "error";
    await newFile.save();

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
