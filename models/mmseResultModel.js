const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: String,
  totalScore: Number,
  stage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MMSE_Result", resultSchema);