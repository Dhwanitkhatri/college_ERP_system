import express from 'express';
import multer from 'multer';
import {
    uploadMaterial,
    getMaterials,
    getMaterialById,
    downloadMaterial,
    deleteMaterial,
    getFacultySubjectsByClass
} from '../controllers/learningMaterialController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ dest: 'temp/' }); // files will be moved in controller

// All routes require authentication
router.use(authMiddleware);
// to fetch the subjects
router.get("/subject",authMiddleware , getFacultySubjectsByClass);

// Upload material (faculty only)
router.post('/', upload.single('file'), uploadMaterial);

// Get all materials (with filters)
router.get('/', getMaterials);

// Get single material metadata
router.get('/:id', getMaterialById);

// Download material
router.get('/:id/download', downloadMaterial);

// Delete material (faculty only – must be owner)
router.delete('/:id', deleteMaterial);



export default router;