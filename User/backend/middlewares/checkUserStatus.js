const { User } = require("../models/User");
const checkUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("User status:", user.status); // <--- debug here

    if (user.status !== "active") {
      return res.status(403).json({ msg: "Account blocked. Access denied." });
    }

    next();
  } catch (err) {
    console.error("Status check error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports = checkUserStatus;
