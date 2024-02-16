const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const IMAGES_ROOT_DIR = path.join(__dirname, "../images");

router.get("/list-images", (req, res) => {
  // Extract directory from query parameters
  const directory = req.query.directory;
  if (!directory) {
    return res.status(400).json({ message: "Directory parameter is required" });
  }

  // Construct the full path to the directory
  const dirPath = path.join(IMAGES_ROOT_DIR, directory);

  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    return res.status(404).json({ message: "Directory not found" });
  }

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Failed to list images:", err);
      return res.status(500).json({ message: "Failed to list images" });
    }

    // Filter files by extension
    const filteredFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".png", ".jpeg", ".jpg", ".gif"].includes(ext);
    });

    const imageURLs = filteredFiles.map(
      (file) => `http://localhost:3030/images/${directory}/${file}`
    );
    res.json(imageURLs);
  });
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const images = require("../utils/sharedImages");

// // Assume savedImages is globally accessible or use some form of storage
// const allImages = images.getImages();

// router.get("/images", (req, res) => {
//   let htmlResponse = `<h2>Images</h2><div style="display: flex; flex-wrap: wrap;">`;
//   allImages.forEach((image) => {
//     const imageUrl = `/images/${image}`;
//     htmlResponse += `<div style="margin: 10px;"><a href="${imageUrl}" target="_blank"><img src="${imageUrl}" alt="Uploaded Image" style="width:100px; height:auto;"></a></div>`;
//   });
//   htmlResponse += `</div><a href="/">Back</a>`;
//   res.send(htmlResponse);
// });

// module.exports = router;
