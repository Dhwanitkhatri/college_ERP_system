import {submitFeedback ,getStudentFeedback ,getAllFeedbacks ,acceptFeedback ,rejectFeedback ,getPendingFeedbacks , getFacultyApprovedFeedback ,getFacultyForStudentFeedback} from "../controllers/feedbackController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

// routes/studentFeedback.routes.js
router.post("/submit", authMiddleware,submitFeedback);
router.get("/my-feedback/:studentId",authMiddleware, getStudentFeedback);

// routes/adminFeedback.routes.js
router.get("/all", authMiddleware,adminMiddleware,getAllFeedbacks);
router.put("/accept/:id", authMiddleware,adminMiddleware,acceptFeedback);
router.put("/reject/:id", authMiddleware,adminMiddleware,rejectFeedback);
router.get("/pending", authMiddleware,adminMiddleware,getPendingFeedbacks);

// routes/facultyFeedback.routes.js
router.get("/accepted", authMiddleware,getFacultyApprovedFeedback);

//for the student to fetch the faculty 
router.get("/faculty-feedback",authMiddleware,getFacultyForStudentFeedback);

export default router;