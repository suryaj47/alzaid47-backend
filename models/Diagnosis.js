const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testType: {
    type: String,
    enum: ["demographic", "cognitive", "mri"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    required: true,
  },
  answers: {
    type: Object, // store answers (future use)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Diagnosis", diagnosisSchema);