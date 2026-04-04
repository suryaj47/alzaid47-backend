const express = require("express");
const router = express.Router();

const controller = require("../controllers/demographicController");
const auth = require("../middleware/authMiddleware");

// 🔐 All routes protected
router.post("/", auth, controller.createTest);
router.patch("/:id/result", auth, controller.updateResult);
router.get("/latest", auth, controller.getLatest);
router.get("/history", auth, controller.getHistory);
router.get("/:id", auth, controller.getById);
router.delete("/:id", auth, controller.deleteTest);

module.exports = router;