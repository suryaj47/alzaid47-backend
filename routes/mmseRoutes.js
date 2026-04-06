const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addQuestions,
  getQuestions,
  submitTest,
  deleteAllQuestions
} = require("../controllers/mmseController");

router.post("/addQuestions", authMiddleware, addQuestions);
router.get("/questions", authMiddleware, getQuestions);
router.post("/submit", authMiddleware, submitTest);
router.delete("/deleteAllQuestions", authMiddleware, deleteAllQuestions);

module.exports = router;