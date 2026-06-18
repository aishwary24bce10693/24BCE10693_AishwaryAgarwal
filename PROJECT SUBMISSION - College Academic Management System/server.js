const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

const departmentRoutes = require("./routes/departmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const staffRoutes = require("./routes/staffRoutes");
const bookRoutes = require("./routes/bookRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "College Academic Management System API is running"
  });
});

app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/books", bookRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid MongoDB ObjectId"
    });
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${duplicateField} already exists`
    });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({
      success: false,
      message: messages
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
