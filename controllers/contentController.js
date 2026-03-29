const Content = require("../models/contentModel");

// CREATE CONTENT
const createContent = async (req, res) => {
try {
const { type, label, text, link } = req.body;

let filePath = null;

if (req.file) {
  filePath = "/" + req.file.path.replace(/\\/g, "/");
}

// Validation
if (type === "text" && !text) {
  return res.status(400).json({ message: "Text required" });
}

if ((type === "audio" || type === "video" || type === "image") && !filePath) {
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
  filePath: filePath,
  link: type === "link" ? link : null
});

const nfcUrl = `${req.protocol}://${req.get("host")}/api/content/${content._id}`;

res.status(201).json({
  contentId: content._id,
  nfcUrl
});

} catch (err) {
res.status(500).json({ message: "Server error" });
}
};

// GET CONTENT (NFC)
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

return res.json({
  type: content.type,
  fileUrl: `${req.protocol}://${req.get("host")}${content.filePath}`
});


} catch (err) {
res.status(500).json({ message: "Server error" });
}
};

module.exports = {createContent,getContent};
