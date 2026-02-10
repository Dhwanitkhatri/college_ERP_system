//class routes.js
import express from 'express';
import { createClass, getAllClasses, updateClass, deleteClass , getCurrentYearClasses,getClassById } from '../controllers/classController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// Create a new class (admins only)
router.post('/', authMiddleware, adminMiddleware, createClass);

// Get all classes (authenticated users)
router.get('/', authMiddleware, adminMiddleware , getAllClasses);
router.get('/current-year', authMiddleware, getCurrentYearClasses);
// Get classes by course ID (authenticated users)
router.get('/:id', authMiddleware, getClassById);

// Update class by ID (admins only)
router.put('/:id', authMiddleware, adminMiddleware, updateClass);

// Delete class by ID (admins only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteClass);

export default router;