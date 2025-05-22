const ActivityLog = require("../models/LogActivity");

async function logActivity({ userId, username, action, details }) {
  try {
    const log = new ActivityLog({ userId, username, action, details });
    await log.save();
  } catch (error) {
    console.error("Failed to save activity log:", error);
  }
}

module.exports = logActivity;
