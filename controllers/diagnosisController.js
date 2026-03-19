const Diagnosis = require("../models/Diagnosis");
const mongoose = require("mongoose");

exports.savetestresult = async (req, res) => {
     try {
    const { testType, score, maxScore} = req.body;

    // 🔥 Risk Calculation Logic
    let percentage = (score / maxScore) * 100;
    let riskLevel = "Low";

    if (percentage < 50) riskLevel = "High";
    else if (percentage < 75) riskLevel = "Moderate";

    const diagnosis = new Diagnosis({
      userId: req.userId,
      testType,
      score,
      maxScore,
      riskLevel
    });

    await diagnosis.save();

    res.json({
      message: "Test result saved successfully",
      diagnosis,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getdiagnosis = async (req, res) => {
    try {
    const userId = req.userId;

    const results = await Diagnosis.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$testType",
          latest: { $first: "$$ROOT" },
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.history = async (req, res) => {
      try {
    const data = await Diagnosis.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};