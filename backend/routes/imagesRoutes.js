/**
 * Express router for handling image routes.
 * @module routes/imagesRoutes
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const IMAGES_ROOT_DIR = path.join(__dirname, "../images");

/**
 * GET /list-images
 * Retrieves a list of image URLs from the specified directory.
 * @name GET/list-images
 * @function
 * @memberof module:routes/imagesRoutes
 * @param {string} directory - The directory to retrieve images from.
 * @returns {Object} - The list of image URLs.
 * @throws {Object} - Returns an error object if the directory parameter is missing or the directory is not found.
 */
router.get("/list-images", (req, res) => {
  const directory = req.query.directory;
  if (!directory) {
    return res.status(400).json({ message: "Directory parameter is required" });
  }

  const dirPath = path.join(IMAGES_ROOT_DIR, directory);

  if (!fs.existsSync(dirPath)) {
    return res.status(404).json({ message: "Directory not found" });
  }

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Failed to list images:", err);
      return res.status(500).json({ message: "Failed to list images" });
    }

    const filteredFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".png", ".jpeg", ".jpg", ".gif"].includes(ext);
    });

    const imageURLs = filteredFiles.map(
      (file) => `/images/${directory}/${file}`
    );
    res.json(imageURLs);
  });
});

module.exports = router;
