// Subject Component Routes
import express from 'express';
import {
    createComponent,
    getComponentsBySubject,
    updateComponent,
    deleteComponent 
} from '../controllers/subjectComponentController.js';

const router = express.Router();

// Create a new component
router.post('/', createComponent);
// Get components by subject ID
router.get('/:subject_id', getComponentsBySubject);
// Update a component
router.put('/:component_id', updateComponent);
// Delete a component
router.delete('/:component_id', deleteComponent);

export default router;