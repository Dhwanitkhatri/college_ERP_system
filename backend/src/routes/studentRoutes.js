//student routes
import express from "express";
import { createStudent, getAllStudents, getStudentById, updateStudentById, deleteStudentById } from "../controllers/studentController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new student (admins only)
router.post("/", authMiddleware, adminMiddleware, createStudent);

// Get all students (authenticated users)
router.get("/", authMiddleware, adminMiddleware, getAllStudents);

// Get a student by ID (authenticated users)
router.get("/:id", authMiddleware, adminMiddleware, getStudentById);

// Update a student by ID (admins only)
router.put("/:id", authMiddleware, adminMiddleware, updateStudentById);

// Delete a student by ID (admins only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteStudentById);

export default router;

