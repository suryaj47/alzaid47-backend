const Demographic = require("../models/Demographic");

// ✅ CREATE TEST
exports.createTest = async (req, res) => {
  try {
    const data = await Demographic.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(data);
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