import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Secure route — token required
router.get("/dashboard", authMiddleware, getDashboardData);

export default router;
