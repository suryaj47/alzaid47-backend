const Content = require("../models/contentModel");

// CREATE CONTENT
const createContent = async (req, res) => {
  try {
    const { type, label, text, link } = req.body;

    let fileUrl = null;

    // Cloudinary gives us secure_url directly on req.file
    if (req.file) {
      fileUrl = req.file.path; // cloudinary storage puts secure_url in path
    }

    // Validation
    if (type === "text" && !text) {
      return res.status(400).json({ message: "Text required" });
    }
    if (["audio", "video", "image"].includes(type) && !fileUrl) {
      return res.status(400).json({ message: "File required" });
    }
    if (type === "link" && !link) {
      return res.status(400).json({ message: "Link required" });
    }

    const content = await Content.create({
      owner: req.userId,
      type,
      label,
      text: type === "text" ? text : null,
      fileUrl: fileUrl,         // store full cloudinary URL
      link: type === "link" ? link : null,
    });

    const nfcUrl = `${req.protocol}://${req.get("host")}/api/content/${content._id}`;

    res.status(201).json({
      contentId: content._id,
      nfcUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET CONTENT (NFC scan - no auth)
const getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Not found" });
    }

    if (content.type === "text") {
      return res.json({ type: "text", data: content.text });
    }

    if (content.type === "link") {
      return res.json({ type: "link", link: content.link });
    }

    // image / video / audio — return cloudinary URL directly
    return res.json({
      type: content.type,
      fileUrl: content.fileUrl,   // already a full https:// URL
      label: content.label,
      createdAt: content.createdAt,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createContent, getContent };