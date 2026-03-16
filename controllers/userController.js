const User = require("../models/userModel");

exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.userId).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};
exports.updateProfile = async (req, res) => {

  try {

    const { age, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { age, gender },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};

exports.uploadProfileImage = async (req, res) => {

  try {

    const imagePath = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: imagePath },
      { new: true }
    );

    res.json({
      message: "Profile image updated",
      profileImage: user.profileImage
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};