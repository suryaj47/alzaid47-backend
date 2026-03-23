const express = require("express");
const router = express.Router();

const {
  createNFC,
  getNFCById,
} = require("../controllers/nfcController");

const verifyToken = require("../middleware/authMiddleware");

// ✅ CREATE
router.post("/create", verifyToken, createNFC);

// ✅ READ (PUBLIC)
router.get("/:id", getNFCById);

module.exports = router;