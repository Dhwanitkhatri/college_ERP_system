//time-table routes
import express from 'express';
import { createTimetableEntry, getAllTimetableEntries, getAvailableTimeSlots, updateTimetableEntry, deleteTimetableEntry , getCurrentYearClasses , getSubject , getFaculty ,getTimetable} from '../controllers/timetableController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new timetable entry (admins only)
router.post('/', authMiddleware, adminMiddleware, createTimetableEntry);

// Get all timetable entries (authenticated users)
router.get('/', authMiddleware, adminMiddleware, getAllTimetableEntries);

// Get timetable by class ID (authenticated users)

// Get timetable by faculty ID (authenticated users)
router.get('/my-timetable', authMiddleware, getTimetable);

// Get available time slots for a class on a specific day (authenticated users)
router.get('/available-slots/:class_id/:day_of_week', authMiddleware, adminMiddleware,getAvailableTimeSlots);

// Update a timetable entry by ID (admins only)
router.put('/:id', authMiddleware, adminMiddleware, updateTimetableEntry);

// Delete a timetable entry by ID (admins only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteTimetableEntry);
router.get('/current-year-classes', authMiddleware, getCurrentYearClasses);
router.get('/subjects', authMiddleware, getSubject);
router.get('/faculties', authMiddleware, getFaculty);


export default router;

