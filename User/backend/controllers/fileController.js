const File = require("../models/File");
const XLSX = require("xlsx");
const fs = require("fs");
const logActivity = require("../utils/LogActivity");
// Dummy function for processing file - replace with your actual logic
async function processFile(filePath) {
  try {
    // TODO: Add actual file processing logic here
    // e.g. parse Excel, analyze data, etc.
    // Return { success: true } or { success: false } accordingly
    return { success: true }; // Simulate success
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
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const rowCount = jsonData.length;

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: filePath,
      size: req.file.size,
      uploadedBy: req.user.id,
      rowCount,
      status: "pending",
    });

    await newFile.save();
    const user = req.user;
    await logActivity({
      userId: user.id,
      username: user.name || user.email,
      action: "File Upload",
      details: `Uploaded Excel file: ${req.file.originalname}`,
    });

    // Process the file
    const processResult = await processFile(filePath);

    if (processResult.success) {
      newFile.status = "processed";
    } else {
      newFile.status = "error";
    }
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

    const uploads = await File.find({ uploadedBy: userId }).sort({
      uploadedAt: -1,
    });
    res.status(200).json({ uploads });
  } catch (err) {
    console.error("Fetch my uploads error:", err);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};
