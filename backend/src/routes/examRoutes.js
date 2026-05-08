// routes/exam.routes.js
import express from "express";
import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  getExams
} from "../controllers/examController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD operations
router.post("/", authMiddleware, adminMiddleware, createExam);
router.get("/current-year-exam", authMiddleware , adminMiddleware , getExams)
router.get("/", authMiddleware, adminMiddleware, getAllExams);
router.get("/:exam_id", authMiddleware, adminMiddleware, getExamById);
router.put("/:exam_id", authMiddleware, adminMiddleware, updateExam);
router.delete("/:exam_id", authMiddleware, adminMiddleware, deleteExam);

// Status management
router.patch("/:exam_id/publish",authMiddleware, adminMiddleware, publishExam);

export default router;