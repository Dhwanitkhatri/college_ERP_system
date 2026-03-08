//om ganeshshaya namah
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
import studentReportRoutes from "./src/routes/studentReportRoutes.js";
import feeSatuseRoutes from "./src/routes/feeStatusRoutes.js"
import sessionPlanningRoutes from "./src/routes/sessionPlanningRoutes.js"
import attdanceRoutes from "./src/routes/attendanceRoutes.js";
import eventsRoutes from "./src/routes/eventsRouts.js";
import subjectComponentRoutes from "./src/routes/subjectComponentRoutes.js";
import examRoutes from "./src/routes/examRoutes.js";
import marksRoutes from "./src/routes/marksRoutes.js";
import examtimetableRoutes from "./src/routes/examTimetableRoutes.js";
import resultRoutes from "./src/routes/resultRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import backlogRoutes from "./src/routes/backlogRoutes.js";
import studentResultRoutes from "./src/routes/studentResultRoutes.js";
import learningMaterialRoutes from "./src/routes/learningMaterialRoutes.js";
import hallticketRoutes from "./src/routes/hallticketRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: `http://${process.env.SERVER_IP}:5173`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profilePictureRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/reports", studentReportRoutes);
app.use("/api/fee",feeSatuseRoutes);
app.use("/api/session",sessionPlanningRoutes);
app.use("/api/attendance",attdanceRoutes);
app.use("/api/event", eventsRoutes);
app.use("/api/components", subjectComponentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/exam-timetable", examtimetableRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/feedback",feedbackRoutes);
app.use("/api/backlogs", backlogRoutes);
app.use("/api/student-results", studentResultRoutes);
app.use("/api/learning-materials", learningMaterialRoutes);
app.use("/api/hall-tickets", hallticketRoutes);


app.get("/", (req, res) => {
  res.send("College ERP System Backend is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
