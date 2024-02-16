const express = require("express");
const router = express.Router();
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const images = require("../utils/sharedImages");

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

const upload = multer({ storage: storage });
const savedImages = [];
const imagesDir = path.join(__dirname, "../images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

router.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries(); // an array of ZipEntry records

  zipEntries.forEach((entry) => {
    const entryName = entry.entryName;
    // Generate a unique name for each image file using UUID
    const uniqueImageName = uuidv4() + path.extname(entryName); // Add file extension to the unique name

    // For .docx files
    if (
      entryName.startsWith("word/media/") &&
      entryName.match(/\.(jpg|jpeg|png|gif)$/)
    ) {
      const targetPath = path.join(imagesDir, uniqueImageName); // Use uniqueImageName here
      try {
        fs.writeFileSync(targetPath, entry.getData());
        //savedImages.push(uniqueImageName);
        images.addImage(uniqueImageName);
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }

    // For .xlsx files
    if (
      entryName.startsWith("xl/media/") &&
      entryName.match(/\.(jpg|jpeg|png|gif)$/)
    ) {
      const targetPath = path.join(imagesDir, uniqueImageName); // Use uniqueImageName here
      try {
        fs.writeFileSync(targetPath, entry.getData());
        //savedImages.push(uniqueImageName);
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

  res.redirect("/images");
});

module.exports = router;
