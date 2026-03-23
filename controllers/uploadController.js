exports.uploadFile = (req, res) => {
  try {
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
      message: "File uploaded",
      url: fileUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};