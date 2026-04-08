const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addQuestions,
  getQuestions,
  submitTest,
  deleteAllQuestions,
  getLatestmmse
} = require("../controllers/mmseController");
const { getLatest } = require("../controllers/demographicController");

router.post("/addQuestions", authMiddleware, addQuestions);
router.get("/questions", authMiddleware, getQuestions);
router.post("/submit", authMiddleware, submitTest);
router.delete("/deleteAllQuestions", authMiddleware, deleteAllQuestions);
router.get("/latest",authMiddleware,getLatestmmse);

module.exports = router;