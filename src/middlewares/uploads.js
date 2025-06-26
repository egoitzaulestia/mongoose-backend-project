// middlewares/uploads.js

const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Make sure uploads/ exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// File‐type filter
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG/PNG images are allowed"), false);
};

// Multer instance with 2 MB limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

// Wrapper to get friendly JSON errors
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // multer-specific errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Max size is 2 MB.",
        });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // unknown error (e.g. fileFilter)
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Multiple images wrapper
const uploadArray =
  (fieldName, maxCount = 4) =>
  (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            message: `Too many files. Max ${maxCount}`,
          });
        }
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "One of the files is too large. Max size is 2 MB each.",
          });
        }
        return res.status(400).json({ message: err.message });
      }
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };

module.exports = {
  raw: upload,
  single: uploadSingle,
  array: uploadArray,
};
