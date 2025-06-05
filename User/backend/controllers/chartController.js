const Chart = require("../models/Charts");
const logActivity = require("../utils/LogActivity");

exports.uploadChart = async (req, res) => {
  try {
    const {
      title,
      username,
      xAxis,
      yAxis,
      chartType,
      typeOfChart,
      typeOfDimension,
      image,
      createdBy,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !username ||
      !xAxis ||
      !chartType ||
      !typeOfChart ||
      !typeOfDimension ||
      !createdBy
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = req.user;
    const newChart = new Chart({
      title,
      username,
      xAxis,
      yAxis,
      chartType,
      typeOfChart,
      typeOfDimension,
      image,
      createdBy,
    });
    await logActivity({
      userId: user.id,
      username: user.name || user.email,
      action: "Chart Upload",
      details: `Chart titled "${title}" uploaded successfully`,
    });
    await newChart.save();
    res
      .status(201)
      .json({ message: "Chart uploaded successfully", chart: newChart });
  } catch (error) {
    console.error("Error uploading chart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Optional: Get all charts
exports.getAllCharts = async (req, res) => {
  try {
    const charts = await Chart.find().sort({ createdAt: -1 }).limit(20);
    res.json(charts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching charts" });
  }
};