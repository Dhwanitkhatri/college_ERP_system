//class routes.js
import express from 'express';
import { createClass, getAllClasses, getClassesByCourse, updateClassById, deleteClassById } from '../controllers/classController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// Create a new class (admins only)
router.post('/', authMiddleware, adminMiddleware, createClass);

// Get all classes (authenticated users)
router.get('/', authMiddleware, adminMiddleware , getAllClasses);

// Get classes by course ID (authenticated users)
router.get('/course/:course_id', authMiddleware, getClassesByCourse);

// Update class by ID (admins only)
router.put('/:id', authMiddleware, adminMiddleware, updateClassById);

// Delete class by ID (admins only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteClassById);

export default router;