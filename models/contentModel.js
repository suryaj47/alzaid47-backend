const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["text", "audio", "video", "image", "link"],
    required: true
  },

  label: {
    type: String,
    required: true
  },

  text: {
    type: String
  },

  filePath: {
    type: String
  },

  link: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Content", contentSchema);