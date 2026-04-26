const MRI = require("../models/mriModel");
const cloudinary = require("../config/cloudinaryConfig");
const axios = require("axios");
const FormData = require("form-data");  // ← add this
const fs = require("fs");        

exports.createMRI = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.userId;
    const FastAPIURL = `${process.env.ML_URL}/predictmri`;
    const ValidateURL = `${process.env.ML_URL}/validateimage`;

    // 1. Validate if it's an MRI image first
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const validateResponse = await axios.post(ValidateURL, formData, {
      headers: {
        ...formData.getHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (validateResponse.data !== 1) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err.message);
      });
      return res.status(422).json({ error: "Uploaded image is not a valid MRI scan" });
    }

    // 2. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    // Delete temp file after upload
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err.message);
    });

    // 3. Save in DB
    const newScan = await MRI.create({
      user_id: userId,
      file_url: result.secure_url,
      status: "processing",
    });

    // 4. Respond immediately
    res.status(201).json({
      scan_id: newScan._id,
      status: "processing",
    });

    // 5. Run ML in background
    axios
      .post(
        FastAPIURL,
        {
          scan_id: String(newScan._id),
          file_url: result.secure_url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then(async (response) => {
        await MRI.findByIdAndUpdate(newScan._id, {
          prediction: response.data.prediction,
          confidence: response.data.confidence,
          probabilities: response.data.probabilities,
          status: "completed",
          updated_at: new Date(),
        });
      })
      .catch(async (err) => {
        console.error("ML Error:", err.message);
        console.error("ML URL:", FastAPIURL);
        console.error("Error code:", err.code);
        await MRI.findByIdAndUpdate(newScan._id, {
          status: "failed",
        });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 🔹 UPDATE → ML result (called by FastAPI)
exports.updateMRI = async (req, res) => {
  try {
    const { scan_id } = req.params;
    const { prediction, confidence, probabilities } = req.body;

    const updated = await MRI.findByIdAndUpdate(
      scan_id,
      {
        prediction,
        confidence,
        probabilities,
        status: "completed",
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Scan not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 HISTORY → Last 5 scans
exports.getHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const history = await MRI.find({
      user_id: userId,
      prediction: { $ne: null },
    })
      .sort({ created_at: -1 })
      .limit(5);

    res.json(history);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 LATEST → Last result
exports.getLatest = async (req, res) => {
  try {
    const userId = req.userId;

    const latest = await MRI.findOne({
      user_id: userId,
      prediction: { $ne: null },
    }).sort({ created_at: -1 });

    res.json(latest);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 STATUS → Check processing
exports.getStatus = async (req, res) => {
  try {
    const { scan_id } = req.params;
    const userId = req.userId;

    const scan = await MRI.findOne({
      _id: scan_id,
      user_id: userId,
    });

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    res.json({
      status: scan.status,
      prediction: scan.prediction,
      confidence: scan.confidence,       // ← add this
      probabilities: scan.probabilities, 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};