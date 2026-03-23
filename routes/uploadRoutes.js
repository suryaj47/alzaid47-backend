const express = require("express");
const router = express.Router();

const { uploadFile } = require("../controllers/uploadController");
const upload = require("../middleware/upload"); // multer config
const verifyToken = require("../middleware/authMiddleware"); // JWT middleware

// ✅ Upload file route
router.post("/", verifyToken, upload.single("file"), uploadFile);

module.exports = router;