const express = require("express");
const router = express.Router();

const { createContent, getContent } = require("../controllers/contentController");
const upload = require("../middleware/uploadMiddleware"); // your multer file
const protect = require("../middleware/authMiddleware"); // your auth

// 🔐 CREATE CONTENT (Protected)
router.post(
"/",
protect,
upload.single("file"), // handles audio/video/image
createContent
);

// 🌍 GET CONTENT (Public - NFC will hit this)
router.get("/:id", getContent);

module.exports = router;
