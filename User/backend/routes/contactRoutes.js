const express = require("express");
const router = express.Router();
const { handleContact } = require("../controllers/contactController");

// POST /api/contact
router.post("/contact", handleContact);

module.exports = router;
