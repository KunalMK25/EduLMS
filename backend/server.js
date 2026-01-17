const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://edu-lms-six.vercel.app",
    ],
  })
);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/courses", require("./routes/courseRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));

app.get("/", (req, res) => {
  res.send("LMS Backend is Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.error(err);
  });
