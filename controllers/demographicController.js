const Demographic = require("../models/Demographic");

const axios = require("axios");

// ✅ CREATE TEST + ML
exports.createTest = async (req, res) => {
  try {
    // 🔹 Step 1: Save initial data
    const test = await Demographic.create({
      ...req.body,
      userId: req.userId,
    });

    // 🔹 Step 2: Call ML API
    let prediction = null;
    let confidence = null;

    try {
      const mlRes = await axios.post(
        "http://localhost:8000/predictdemo", // 🔴 change if needed
        req.body
      );

      prediction = mlRes.data.prediction;
      confidence = mlRes.data.confidence;
    } catch (mlErr) {
      console.log("ML ERROR:", mlErr.message);
      // 👉 don't fail whole API if ML fails
    }

    // 🔹 Step 3: Update DB if ML worked
    if (prediction !== null) {
      test.prediction = prediction;
      test.confidence = confidence;
      test.status = "completed";

      await test.save();
    }

    // 🔹 Step 4: Return response
    res.status(201).json(test);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE RESULT (ML will call this)
exports.updateResult = async (req, res) => {
  try {
    const { prediction, confidence } = req.body;

    const updated = await Demographic.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        prediction,
        confidence,
        status: "completed",
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET LATEST
exports.getLatest = async (req, res) => {
  try {
    const data = await Demographic.findOne({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET HISTORY (last 5)
exports.getHistory = async (req, res) => {
  try {
    const data = await Demographic.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET BY ID
exports.getById = async (req, res) => {
  try {
    const data = await Demographic.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
exports.deleteTest = async (req, res) => {
  try {
    const deleted = await Demographic.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};