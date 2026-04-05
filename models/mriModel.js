const mongoose = require("mongoose");

const mriSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // foreign key
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  prediction: {
    type: String,
    default: null,
  },
  confidence: {
    type: Number,
    default: null,
  },
  probabilities: {
    CN: Number,
    MCI: Number,
    AD: Number,
  },
  status: {
    type: String,
    enum: ["uploaded", "processing", "completed", "failed"],
    default: "uploaded",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model("MRI", mriSchema);