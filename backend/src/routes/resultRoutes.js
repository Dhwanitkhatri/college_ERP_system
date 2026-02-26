// Result Routses
import express from "express";
import { generateStudentResult,
  generateBulkResults } from "../controllers/resultController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate result for a single student
router.post("/", authMiddleware, adminMiddleware, generateStudentResult);

// Generate results in bulk for all students in a semester/course
router.post("/all", authMiddleware, adminMiddleware, generateBulkResults);

export default router;