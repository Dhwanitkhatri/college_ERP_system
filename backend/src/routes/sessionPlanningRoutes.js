import { createSessionPlan, getFacultyTechInfo, getAllSessionPlans, getFacultyScheduleForDate, updateSessionPlan, deleteSessionPlan ,getSessionPlanBySubject,
  updateSessionPlanStatus ,getFacultySubjectsFromTimetable} from "../controllers/sessionPlanningController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import express from "express";


const router = express.Router();

// Create session plan
router.post('/', authMiddleware, createSessionPlan);

// Get faculty teaching information (classes and subjects taught)
router.get('/teaching-info', authMiddleware, getFacultyTechInfo);
//getfaulty subjects
router.get("/get-facultysubject",authMiddleware,getFacultySubjectsFromTimetable);
// Get all session plans for faculty
router.get('/all', authMiddleware, getAllSessionPlans);

// get session plan by date
router.get('/date', authMiddleware, getFacultyScheduleForDate);

// Update session plan
router.put('/:plan_id', authMiddleware, updateSessionPlan);

//update 
router.get("/session-plan/:subjectId", authMiddleware, getSessionPlanBySubject);
//update  status
router.put("/session-plan/status/:id", authMiddleware, updateSessionPlanStatus);


// Delete session plan
router.delete('/:plan_id', authMiddleware, deleteSessionPlan);

export default router;