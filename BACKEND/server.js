import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

import teacherAuthRoutes from "./routes/teacherAuthRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import Student from "./models/Student.js";
import studentRoutes from "./routes/studentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Fix: Go one level up to access FRONTEND folder
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "..", "FRONTEND");
app.use(express.static(frontendPath));

// Database connection
const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = { dbname: "QUIZPOINT" };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
connectDB(process.env.DATABASE_URL);

// API Routes
app.use("/api/teacher/auth", teacherAuthRoutes);
app.use("/api/student/auth", studentAuthRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api", quizRoutes);

// Fallback for non-API routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 404 for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
