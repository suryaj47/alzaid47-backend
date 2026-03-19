const Diagnosis = require("../models/Diagnosis");

exports.savetestresult = async (req, res) => {
     try {
    const { testType, score, maxScore, answers } = req.body;

    // 🔥 Risk Calculation Logic
    let percentage = (score / maxScore) * 100;
    let riskLevel = "Low";

    if (percentage < 50) riskLevel = "High";
    else if (percentage < 75) riskLevel = "Moderate";

    const diagnosis = new Diagnosis({
      userId: req.user.id,
      testType,
      score,
      maxScore,
      riskLevel,
      answers,
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
    const userId = req.user.id;

    // get latest test for each type
    const results = await Diagnosis.aggregate([
      { $match: { userId: new require("mongoose").Types.ObjectId(userId) } },
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
    const data = await Diagnosis.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};