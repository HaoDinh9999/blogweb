const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const fs = require("fs");

require("dotenv").config({ path: "./config.env" });
const globalErrorHandler = require("./controller/errorController");
app.use(express.json());
const port = process.env.PORT || 5000;
app.use(cors());
app.use(fileUpload());

mongoose
  .connect(process.env.DATABASE, {})
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}, ${process.env.DATABASE}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Data.now() + path.extname(file.originalname));
  },
});

// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("3000", () => {
  console.log("Backend is running.");
});
app.use(globalErrorHandler);
