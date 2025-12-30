// students report  routes
import express from "express";
import { getStudentDateWiseReport , getClassWiseReport ,getClassesForDatewiseReport ,getSubjectsAndStudentForDatewiseReport , getOverallClassAttendancereport} from "../controllers/studentReportController.js";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get date wise attendance report for a student
router.get("/student/date-wise-report", authMiddleware, getStudentDateWiseReport);

// Route to get class wise attendance report
router.post("/student/class-wise-report", authMiddleware, getClassWiseReport);

// Route to get classes for datewise report
router.get("/student/classes-for-datewise-report", authMiddleware, getClassesForDatewiseReport);
// Route to get subjects and students for datewise report
router.get("/student/subjects-and-students-for-datewise-report", authMiddleware, getSubjectsAndStudentForDatewiseReport);

router.get("/overall-class-wise" , authMiddleware ,getOverallClassAttendancereport )
export default router;