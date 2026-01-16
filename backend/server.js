const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

// Parse JSON
app.use(express.json());

// ✅ CORS FIX (Netlify + Localhost)
app.use(
  cors({
    origin: [
      "https://edulms1.netlify.app", // Netlify frontend
      "http://localhost:5173",       // Local dev (Vite)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Allow preflight requests
app.options("*", cors());

/* =========================
   STATIC FILES (UPLOADS)
========================= */

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/courses", require("./routes/courseRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("LMS Backend is Running");
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
