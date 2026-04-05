const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");

const {
  createMRI,
  updateMRI,
  getHistory,
  getLatest,
  getStatus,
} = require("../controllers/mriController");

// multer config
const upload = multer({ dest: "uploads/" });

router.post("/create", upload.single("file"), auth, createMRI);
router.put("/update/:scan_id", auth, updateMRI);
router.get("/history", auth, getHistory);
router.get("/latest", auth, getLatest);
router.get("/status/:scan_id", auth, getStatus);

module.exports = router;