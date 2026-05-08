import express from "express";
import {
  createBacklogExam,
  getEligibleStudents,
  enterBacklogMarks,
  generateBacklogResult,
  getActiveBacklogs,
  getStudentBacklogHistory
} from "../controllers/backlogController.js";
import { authMiddleware,adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createBacklogExam);
router.get("/eligible/:subject_id",authMiddleware, adminMiddleware, getEligibleStudents);
router.post("/marks",authMiddleware, adminMiddleware, enterBacklogMarks);
router.post("/generate-result",authMiddleware, adminMiddleware, generateBacklogResult);
router.get("/active",authMiddleware, adminMiddleware, getActiveBacklogs);
router.get("/student/:student_id",authMiddleware, adminMiddleware, getStudentBacklogHistory);

export default router;