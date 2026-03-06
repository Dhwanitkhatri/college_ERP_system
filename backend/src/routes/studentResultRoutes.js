import express from "express";
import {
  getMyResults,
  getMyDetailedResult
} from "../controllers/studentResultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all results for the logged-in student
router.get("/", getMyResults);

// Get detailed result for a specific exam
router.get("/:exam_id", getMyDetailedResult);

export default router;