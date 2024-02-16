const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const IMAGES_DIR = path.join(__dirname, "../uploads");

router.get("/list-images", (req, res) => {
  fs.readdir(IMAGES_DIR, (err, files) => {
    if (err) {
      console.error("Failed to list images:", err);
      res.status(500).json({ message: "Failed to list images" });
      return;
    }
    const imageURLs = files.map(
      (file) => `http://localhost:3030/images/${file}`
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
