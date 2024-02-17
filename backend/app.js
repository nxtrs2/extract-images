const express = require("express");
const cors = require("cors");

const app = express();
const port = 3030;

const allowedOrigins = [
  "https://www.extractimages.io",
  "https://extractimages.io",
  "http://localhost:3000",
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  let origin = req.header("Origin");
  if (allowedOrigins.includes(origin)) {
    corsOptions = { origin: true }; // Reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // Disable CORS for this request
  }
  callback(null, corsOptions); // Callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

const uploadRoutes = require("./routes/uploadRoutes");
const imageRoutes = require("./routes/imagesRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

app.use("/images", express.static("images"));
app.use(express.static("public"));

app.use(uploadRoutes);
app.use(imageRoutes);
app.use(downloadRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
