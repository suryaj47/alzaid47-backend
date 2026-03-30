const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resource_type = "auto";
    return {
      folder: "alzaid_memories",
      resource_type,
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "mp3", "wav", "m4a"],
    };
  },
});

const upload = multer({ storage });
module.exports = upload;