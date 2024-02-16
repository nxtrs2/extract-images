const express = require("express");
const cors = require("cors");

const app = express();
const port = 3030;

app.use(cors());

const uploadRoutes = require("./routes/uploadRoutes");
const imageRoutes = require("./routes/imagesRoutes");

app.use("/images", express.static("images"));
app.use(express.static("public"));

app.use(uploadRoutes);
app.use(imageRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
