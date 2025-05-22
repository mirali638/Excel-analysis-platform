const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken"); // ✅ REQUIRED to use jwt.verify
const { uploadFile, getMyUploads } = require("../controllers/fileController");

const router = express.Router();

// 🔐 JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// 📁 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// 📤 Routes
router.post("/upload", authenticateJWT, upload.single("file"), uploadFile);
router.get("/my-uploads", authenticateJWT, getMyUploads);

module.exports = router;
