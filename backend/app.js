//om ganeshshaya namah
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./src/config/db.js";
import * as models from "./src/model/index.js";
import authRoutes from "./src/routes/authRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import facultyRoutes from "./src/routes/facultyRoutes.js";
import timetableRoutes from "./src/routes/timetableRoutes.js";
import classRoutes from "./src/routes/classRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import profilePictureRoutes from "./src/routes/profilePictureRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import { responseTimeLogger } from "./src/middleware/responseTimeLogger.js";
import subjectRoutes from "./src/routes/subjectRoutes.js";
dotenv.config();
const app = express();
console.log(process.env.SERVER_IP);
app.use(
  cors({
    origin: `http://${process.env.SERVER_IP}:5173`, // Your frontend URL
    credentials: true, // allow cookies if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // IMPORTANT: allow Bearer token
  })
);
app.options("/", cors()); // Enable pre-flight for all routes
app.use(express.json());
app.use("/uploads", express.static("uploads")); //serve static files from uploads directory

const PORT = process.env.PORT || 5000;

// Test DB connection
try {
  await sequelize.authenticate();
  console.log("Database connected successfully!");
} catch (error) {
  console.error("Database connection failed:", error);
}
app.use(responseTimeLogger);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/picture", profilePictureRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);

app.get("/", (req, res) => {
  res.send("College ERP System Backend is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
