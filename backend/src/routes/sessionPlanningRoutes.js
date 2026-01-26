import { createSessionPlan, getFacultyTechInfo, getAllSessionPlans, getFacultyScheduleForDate, updateSessionPlan, deleteSessionPlan } from "../controllers/sessionPlanningController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";


const router = express.Router();

// Create session plan
router.post('/', authMiddleware, createSessionPlan);

// Get faculty teaching information (classes and subjects taught)
router.get('/teaching-info', authMiddleware, getFacultyTechInfo);

// Get all session plans for faculty
router.get('/all', authMiddleware, getAllSessionPlans);

// get session plan by date
router.get('/date', authMiddleware, getFacultyScheduleForDate);

// Update session plan
router.put('/:id', authMiddleware, updateSessionPlan);

// Delete session plan
router.delete('/:id', authMiddleware, deleteSessionPlan);

export default router;