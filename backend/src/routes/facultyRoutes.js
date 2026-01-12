//faculty routes
import express from "express";
import {
    createFaculty,
    getAllFaculties,
    getFacultyById,
    updateFacultyById,
    deleteFacultyById
} from "../controllers/facultyController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//create faculty
router.post("/", authMiddleware,adminMiddleware, createFaculty);

//get all faculties
router.get("/", authMiddleware,adminMiddleware, getAllFaculties);

//get faculty by id
router.get("/:id", authMiddleware,adminMiddleware, getFacultyById);

//update faculty by id
router.put("/:id", authMiddleware,adminMiddleware, updateFacultyById);

//delete faculty by id
router.delete("/:id", authMiddleware,adminMiddleware, deleteFacultyById);
export default router;