const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");         // cloudinary multer
const { createContent, getContent } = require("../controllers/contentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, upload.single("file"), createContent);
router.get("/:id", getContent);

module.exports = router;