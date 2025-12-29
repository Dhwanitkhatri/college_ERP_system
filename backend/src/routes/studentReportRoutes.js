// students report  routes
import express from "express";
import { getStudentDateWiseReport , getClassWiseReport ,getClassesForDatewiseReport} from "../controllers/studentReportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get date wise attendance report for a student
router.post("/student/date-wise-report", authMiddleware, getStudentDateWiseReport);

// Route to get class wise attendance report
router.post("/student/class-wise-report", authMiddleware, getClassWiseReport);

// Route to get classes for datewise report
router.get("/student/classes-for-datewise-report", authMiddleware, getClassesForDatewiseReport);
export default router;