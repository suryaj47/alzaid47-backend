const mongoose = require("mongoose");

const nfcSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  contentType: {
    type: String,
    enum: ["text", "media", "link"],
    required: true,
  },

  content: {
    type: String, // text OR link
  },

  mediaUrl: {
    type: String, // image/video/audio
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NFC", nfcSchema);