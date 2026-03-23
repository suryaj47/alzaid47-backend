const NFC = require("../models/NFC");

// ✅ CREATE NFC DATA
exports.createNFC = async (req, res) => {
  try {
    const { contentType, content, mediaUrl } = req.body;

    const newData = new NFC({
      userId: req.user.id,
      contentType,
      content,
      mediaUrl,
    });

    await newData.save();

    // 🔥 URL for NFC tag
    const nfcUrl = `${req.protocol}://${req.get("host")}/api/nfc/${newData._id}`;

    res.json({
      message: "NFC data created",
      nfcUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ READ NFC (PUBLIC)
exports.getNFCById = async (req, res) => {
  try {
    const data = await NFC.findById(req.params.id);

    if (!data) return res.status(404).send("Not found");

    // 🔥 HTML response (for external scan)
    res.send(`
      <html>
        <body style="font-family:sans-serif;text-align:center;padding:20px;">
          <h2>NFC Content</h2>

          <p><b>Type:</b> ${data.contentType}</p>

          ${
            data.contentType === "text"
              ? `<p>${data.content}</p>`
              : ""
          }

          ${
            data.contentType === "link"
              ? `<a href="${data.content}" target="_blank">Open Link</a>`
              : ""
          }

          ${
            data.mediaUrl
              ? `<div>
                  <img src="${data.mediaUrl}" width="300"/>
                </div>`
              : ""
          }

          <p style="margin-top:20px;color:gray;">
            Created: ${new Date(data.createdAt).toLocaleString()}
          </p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Error loading NFC");
  }
};