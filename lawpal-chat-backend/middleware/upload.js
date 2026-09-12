/**
 * Multer middleware for document uploads
 * Accepts: pdf, doc, docx, txt
 */
const multer = require('multer');
const path = require('path');
const config = require('../config');

// Storage: save files with unique names in uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, uniqueSuffix + ext);
  }
});

// File filter: only allow specified types
const fileFilter = (req, file, cb) => {
  if (config.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: PDF, DOC, DOCX, TXT`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize }
});

module.exports = upload;
