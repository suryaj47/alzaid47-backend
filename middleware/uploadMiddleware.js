const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

destination: function (req, file, cb) {

```
let folder = "uploads/profiles"; // default for profile uploads

// If request is for NFC content
if (req.baseUrl.includes("content")) {

  if (file.mimetype.startsWith("audio")) {
    folder = "uploads/nfc/audio";
  } 
  else if (file.mimetype.startsWith("video")) {
    folder = "uploads/nfc/video";
  } 
  else if (file.mimetype.startsWith("image")) {
    folder = "uploads/nfc/image";
  }

}

cb(null, folder);
```

},

filename: function (req, file, cb) {

```
const uniqueName =
  (req.user?.id || "guest") +
  "_" +
  Date.now() +
  path.extname(file.originalname);

cb(null, uniqueName);
```

}

});

const fileFilter = (req, file, cb) => {
if (
file.mimetype.startsWith("audio") ||
file.mimetype.startsWith("video") ||
file.mimetype.startsWith("image")
) {
cb(null, true);
} else {
cb(new Error("Only audio, video, and image files are allowed"), false);
}
};

const upload = multer({
storage,
fileFilter,
limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

module.exports = upload;
