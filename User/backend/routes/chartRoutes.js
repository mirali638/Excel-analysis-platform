const express = require("express");
const router = express.Router();
const chartController = require("../controllers/chartController");
const {
  authenticateJWT,
  authorizeRole,
} = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  authenticateJWT,
  upload.single("image"),
  chartController.uploadChart
);
router.get("/all", chartController.getAllCharts); // Optional: to retrieve charts

module.exports = router;
