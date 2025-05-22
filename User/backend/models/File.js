const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    size: {
      type: Number, // in bytes
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "error"],
      default: "pending",
    },
    filePath: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    rowCount: {
      type: Number,
      required: true, // if always available
    },
  },
  { timestamps: true } // includes createdAt, updatedAt
);

module.exports = mongoose.model("File", fileSchema);
