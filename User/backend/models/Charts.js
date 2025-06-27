const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
  },
  chartType: {
    type: String,
    required: true,
  },
  typeOfChart: {
    type: String,
    required: true,
  },
  typeOfDimension: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or base64
    required: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chart", chartSchema);