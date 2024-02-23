/**
 * Express router for handling file uploads.
 * @module uploadRoutes
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const images = require("../utils/sharedImages");

/**
 * Multer disk storage configuration.
 * @type {object}
 * @property {function} destination - Function to determine the destination directory for uploaded files.
 * @property {function} filename - Function to determine the filename for uploaded files.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

/**
 * Multer configuration for file upload.
 * @type {object}
 * @property {object} storage - Multer disk storage configuration.
 * @property {object} limits - Limits for the uploaded file.
 */
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * Route for handling file upload.
 * @name POST /upload
 * @function
 * @memberof module:uploadRoutes
 * @param {string} path - Express route path.
 * @param {function} middleware - Multer middleware for file upload.
 * @param {function} callback - Express route callback function.
 */
router.post("/upload", upload.single("file"), (req, res) => {
  const directory = uuidv4();
  // This is a temporary solution. The images should be stored in some other place, not in the backend.
  const imagesDir = path.join(__dirname, "../images", directory);

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const filePath = req.file.path;
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();

  zipEntries.forEach((entry) => {
    const entryName = entry.entryName;
    const uniqueImageName = uuidv4() + path.extname(entryName);

    const validDirectories = [
      "word/media/",
      "xl/media/",
      "ppt/media/",
      "Data/" /* For Apple Pages - will have to verify this for Keynote */,
    ];
    const isValidDirectory = validDirectories.some((dir) =>
      entryName.startsWith(dir)
    );
    const isValidFile = entryName.match(/\.(jpg|jpeg|png|gif)$/);

    if (isValidDirectory && isValidFile) {
      const targetPath = path.join(imagesDir, uniqueImageName);
      try {
        fs.writeFileSync(targetPath, entry.getData());
        images.addImage(uniqueImageName);
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  });

  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log("Successfully deleted uploaded file:", filePath);
  });

  res.json({
    success: true,
    message: "File uploaded successfully",
    directory: directory,
  });
});

module.exports = router;
