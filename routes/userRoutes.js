const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadProfileImage } = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile
} = require("../controllers/userController");

router.get("/profile", verifyToken, getProfile);

router.put("/update-profile", verifyToken, updateProfile);
router.post(
  "/upload-photo",
  verifyToken,
  upload.single("photo"),
  uploadProfileImage
);
module.exports = router;