const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { verifyToken: verifyUserToken } = require("../controllers/authController");
const {
  registerUser,
  loginUser,
  forgotPassword
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

router.get("/verify", verifyToken, verifyUserToken);

router.get("/profile", verifyToken, async (req, res) => {

  const user = await User.findById(req.userId).select("-password");

  res.json(user);

});

module.exports = router;