//faculty routes
import express from "express";
import {
    createFaculty,
    getAllFaculties,
    getFacultyById,
    updateFacultyById,
    deleteFacultyById,
    activeInactiveFaculty
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

//to active and inactive the faculty

router.put("/active-inactive/:user_id",authMiddleware,adminMiddleware,activeInactiveFaculty)
export default router;