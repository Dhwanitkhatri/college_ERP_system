import express from "express";
import {createSubject , getAllSubjects , getSubjectById , updateSubjectById ,deleteSubjectById} from "../controllers/subjectControllers.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
// Create a new subject (admins only)
router.post("/",authMiddleware,adminMiddleware,createSubject);
// Get all subjects (authenticated users)
router.get("/",authMiddleware,adminMiddleware,getAllSubjects);  
// Get a subject by ID (authenticated users)
router.get("/:subject_id",authMiddleware,adminMiddleware,getSubjectById);
// Update a subject by ID (admins only)
router.put("/:subject_id",authMiddleware,adminMiddleware,updateSubjectById);
// Delete a subject by ID (admins only)
router.delete("/:subject_id",authMiddleware,adminMiddleware,deleteSubjectById);
export default router;

