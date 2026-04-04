const mongoose = require("mongoose");

const demographicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    age: Number,
    gender: Number,
    education: Number,
    bmi: Number,
    physical_activity: Number,
    smoking: Number,
    alcohol: Number,
    diabetes: Number,
    history: Number,
    sleep_quality: Number,
    dietary: Number,
    employment: Number,
    marital_status: Number,
    social_engagement: Number,
    living: Number,

    // ML Output
    prediction: {
      type: String,
      default: null,
    },
    confidence: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// 🔥 Index for fast queries
demographicSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Demographic", demographicSchema);