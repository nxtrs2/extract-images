const express = require("express");
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3030;

app.use("/images", express.static("images"));
// Configure multer storage
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

app.use(express.static("public"));

// Ensure the images directory exists
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries(); // an array of ZipEntry records

  zipEntries.forEach((entry) => {
    const entryName = entry.entryName;
    // For .docx files
    if (
      entryName.startsWith("word/media/") &&
      entryName.match(/\.(jpg|jpeg|png|gif)$/)
    ) {
      const targetPath = path.join(imagesDir, entryName.split("/").pop());
      fs.writeFileSync(targetPath, entry.getData());
    }
    // For .xlsx files
    if (
      entryName.startsWith("xl/media/") &&
      entryName.match(/\.(jpg|jpeg|png|gif)$/)
    ) {
      const targetPath = path.join(imagesDir, entryName.split("/").pop());
      fs.writeFileSync(targetPath, entry.getData());
    }
  });

  // List images to the user
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      res.send("Failed to list images.");
      return;
    }
    res.send(
      files.map((file) => `<a href="/images/${file}">${file}</a>`).join("<br>")
    );
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
