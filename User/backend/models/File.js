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
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "error"],
      default: "pending",
    },
    originalName: {
      type: String,
      required: true,
    },
    rowCount: {
      type: Number,
      required: true,
    },
    metadata: {
      fileType: String,
      lastModified: Date
    },
    fileType: {
      type: String,
      enum: ['xlsx', 'xls', 'csv'],
      required: true
    }
  }, {  timestamps: true  }
);

// Virtual for formatted size
fileSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

module.exports = mongoose.model("File", fileSchema);