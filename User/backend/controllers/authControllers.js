const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/LogActivity");
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Corrected process.env usage
    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    await logActivity({
      userId: user._id,
      username: user.name || user.email,
      action: "User Signup successful",
      details: "New User Registered",
    });
    res.status(201).json({ message: "successful signup" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || "user",
        name: user.name,
        email: user.email,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
    await logActivity({
      userId: user._id,
      username: user.name || user.email,
      action: "User Login",
      details: "Successful login",
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.logout = async (req, res) => {
  const user = req.user;
  try {
    await logActivity({
      userId: user.id,
      username: user.name || user.email,
      action: "Logout",
      details: "User logged out successfully",
    });

    res.status(200).json({ message: "Logout logged successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
