const express = require("express");
const { signup, login,logout } = require("../controllers/authControllers");
const {
  authenticateJWT,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const checkUserStatus = require("../middlewares/checkUserStatus");
const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Protected Route Example (Only admin can access)
router.get(
  "/admindashboard",
  authenticateJWT,
  authorizeRole(["admin"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome Admin!" });
  }
);

// Protected Route Example (Any authenticated user can access)
router.get("/userdashboard", authenticateJWT, checkUserStatus, (req, res) => {
  res.status(200).json({ message: "Welcome User!" });
});
router.post("/logout", authenticateJWT, logout);
module.exports = router;
