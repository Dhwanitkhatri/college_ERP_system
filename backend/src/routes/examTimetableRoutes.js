import express from "express";
import {
  addTimetable,
  getTimetableByExam,
  updateTimetable,
  deleteTimetable
} from "../controllers/examTimetableController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add subject to exam
router.post("/", authMiddleware, adminMiddleware, addTimetable);

// Get subjects by exam
router.get("/:exam_id",authMiddleware, adminMiddleware, getTimetableByExam);

// Update timetable
router.put("/:id",authMiddleware, adminMiddleware, updateTimetable);

// Delete timetable
router.delete("/:id",authMiddleware, adminMiddleware, deleteTimetable);

export default router;
