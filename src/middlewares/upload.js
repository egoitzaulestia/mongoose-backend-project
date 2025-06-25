const multer = require("multer");
const path = require("path");

// Decide where and how to save files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // create a unique filenname so we don't overwrite
    const uniqueSuffix = Date.now();
  },
});
