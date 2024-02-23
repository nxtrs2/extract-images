/**
 * Express router for handling file download requests.
 * @module downloadRoutes
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

/**
 * GET /download/:directory
 * Download a directory as a ZIP file.
 * @name GET /download/:directory
 * @function
 * @memberof module:downloadRoutes
 * @param {string} req.params.directory - The name of the directory to download.
 * @returns {object} - The ZIP file containing the directory's contents.
 */
router.get("/download/:directory", (req, res) => {
  const directory = req.params.directory;
  const imagesDir = path.join(__dirname, "../images", directory);

  if (!fs.existsSync(imagesDir)) {
    return res.status(404).json({ error: "Directory not found" });
  }

  const zip = new AdmZip();

  fs.readdirSync(imagesDir).forEach((file) => {
    const filePath = path.join(imagesDir, file);
    zip.addLocalFile(filePath);
  });

  const zipFileName = `${directory}.zip`;

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename=${zipFileName}`);

  const zipBuffer = zip.toBuffer();
  res.send(zipBuffer);
});

module.exports = router;
