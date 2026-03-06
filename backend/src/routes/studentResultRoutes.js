import express from "express";
import {
  getMyResults,
} from "../controllers/studentResultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/student-results/my-results
router.get("/my-results", getMyResults);

export default router;