const express = require("express");
const router = express.Router();
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

router.get("/download/:directory", (req, res) => {
  const directory = req.params.directory;
  const imagesDir = path.join(__dirname, "../images", directory);

  // Check if the requested directory exists
  if (!fs.existsSync(imagesDir)) {
    return res.status(404).json({ error: "Directory not found" });
  }

  // Create a new instance of AdmZip
  const zip = new AdmZip();

  // Add the directory's files to the ZIP
  fs.readdirSync(imagesDir).forEach((file) => {
    const filePath = path.join(imagesDir, file);
    zip.addLocalFile(filePath);
  });

  // Define the name of the ZIP file
  const zipFileName = `${directory}.zip`;

  // Set the headers to inform the browser about the download
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename=${zipFileName}`);

  // Send the ZIP file
  const zipBuffer = zip.toBuffer();
  res.send(zipBuffer);
});

module.exports = router;
