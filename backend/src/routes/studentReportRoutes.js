// students report  routes
import express from "express";
import { getStudentDateWiseReport } from "../controllers/studenReportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get date wise attendance report for a student
router.post("/student/date-wise-report", authMiddleware, getStudentDateWiseReport);

export default router;