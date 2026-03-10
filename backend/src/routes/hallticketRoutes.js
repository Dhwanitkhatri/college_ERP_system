import express from 'express';
import {
  generateHallTickets,
  getMyHallTickets,
  getExamsBySemesterAndAcademic
} from '../controllers/hallticketController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);
router.get("/get-exam-for-hallticket",getExamsBySemesterAndAcademic);
// Admin: generate hall tickets with filters in body (POST)
router.post('/generate', generateHallTickets);

// Student: get own hall tickets with filters in query (GET)
router.get('/my', getMyHallTickets);

export default router;