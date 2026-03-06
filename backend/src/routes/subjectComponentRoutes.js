// Subject Component Routes
import express from 'express';
import { authMiddleware , adminMiddleware } from '../middleware/authMiddleware.js';
import {
    createComponent,
    getComponentsBySubject,
    updateComponent,
    deleteComponent,
    subjects
} from '../controllers/subjectComponentController.js';

const router = express.Router();
router.get("/subjects", authMiddleware ,subjects );
// Create a new component
router.post('/', authMiddleware , adminMiddleware , createComponent);
// Get components by subject ID
router.get('/:subject_id', authMiddleware , adminMiddleware ,getComponentsBySubject);
// Update a component
router.put('/:component_id',authMiddleware , adminMiddleware, updateComponent);
// Delete a component
router.delete('/:component_id',authMiddleware , adminMiddleware ,  deleteComponent);
// fetch all the subjects

export default router;