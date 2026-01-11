import { createSessionPlan , getFacultyTechInfo , getAllSessionPlans } from "../controllers/sessionPlanningController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";


const router = express.Router();

// Create session plan
router.post('/',authMiddleware, createSessionPlan);

// Get faculty teaching information (classes and subjects taught)
router.get('/teaching-info',authMiddleware, getFacultyTechInfo);

// Get all session plans for faculty
router.get('/all',authMiddleware, getAllSessionPlans);

export default router;