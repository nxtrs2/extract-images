const express = require("express");
const app = express();
const port = 3030;

const uploadRoutes = require("./routes/uploadRoutes");
const imageRoutes = require("./routes/imagesRoutes");

app.use("/images", express.static("images"));
app.use(express.static("public"));

app.use(uploadRoutes);
app.use(imageRoutes);

// Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });

// Ensure the images directory exists
// const imagesDir = path.join(__dirname, "images");
// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }

// app.post("/upload", upload.single("file"), (req, res) => {
//   const filePath = req.file.path;
//   const zip = new AdmZip(filePath);
//   const zipEntries = zip.getEntries(); // an array of ZipEntry records

//   zipEntries.forEach((entry) => {
//     const entryName = entry.entryName;
//     // Generate a unique name for each image file using UUID
//     const uniqueImageName = uuidv4() + path.extname(entryName); // Add file extension to the unique name

//     // For .docx files
//     if (
//       entryName.startsWith("word/media/") &&
//       entryName.match(/\.(jpg|jpeg|png|gif)$/)
//     ) {
//       const targetPath = path.join(imagesDir, uniqueImageName); // Use uniqueImageName here
//       fs.writeFileSync(targetPath, entry.getData());
//       savedImages.push(uniqueImageName);
//     }

//     // For .xlsx files
//     if (
//       entryName.startsWith("xl/media/") &&
//       entryName.match(/\.(jpg|jpeg|png|gif)$/)
//     ) {
//       const targetPath = path.join(imagesDir, uniqueImageName); // Use uniqueImageName here
//       fs.writeFileSync(targetPath, entry.getData());
//       savedImages.push(uniqueImageName);
//     }
//   });
//   res.redirect("/images");
//   // List images to the user
//   //   fs.readdir(imagesDir, (err, files) => {
//   //     if (err) {
//   //       res.send("Failed to list images.");
//   //       return;
//   //     }
//   //     res.send(
//   //       files.map((file) => `<a href="/images/${file}">${file}</a>`).join("<br>")
//   //     );
//   //   });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
