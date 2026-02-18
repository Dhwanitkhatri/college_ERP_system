import {submitFeedback ,getStudentFeedback ,getAllFeedbacks ,acceptFeedback ,rejectFeedback ,getPendingFeedbacks , getAcceptedFeedbacks} from "../controllers/feedbackController";
import express from "express";
const router = express.Router();

// routes/studentFeedback.routes.js
router.post("/submit", submitFeedback);
router.get("/my-feedback/:studentId", getStudentFeedback);

// routes/adminFeedback.routes.js
router.get("/all", getAllFeedbacks);
router.put("/accept/:id", acceptFeedback);
router.put("/reject/:id", rejectFeedback);
router.get("/pending", getPendingFeedbacks);

// routes/facultyFeedback.routes.js
router.get("/accepted/:facultyId", getAcceptedFeedbacks);

export default router;