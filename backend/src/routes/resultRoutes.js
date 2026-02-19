// Result Routses
import express from "express";
import { generateStudentResult } from "../controllers/resultController.js";
import { authMiddleware , adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Generate Result
router.post("/generate", authMiddleware, adminMiddleware, generateStudentResult);

export default router;