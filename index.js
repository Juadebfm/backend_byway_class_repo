require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorhandler");
const rateLimit = require("express-rate-limit");
// Initialize a express app
const app = express();

//Configure middlewares
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    Credentials: true,
  })
);

//ensure that express can read json
app.use(express.json());

//Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
const profileImagesDir = path.join(uploadDir, "profile-images");
const courseImagesDir = path.join(uploadDir, "course-images");

// Create directories if they don't exist
[uploadDir, profileImagesDir, courseImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});
// Serve static files from uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use("/api/auth", rateLimiter, authRoutes);


//Handle errors globally
app.use(errorHandler);

//Mongo db connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
connectDB();
module.exports = app;
