import express from "express";
import { enterMarks , updateMarks } from "../controllers/marksController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/enter-marks", authMiddleware, enterMarks);
router.put("/update-marks", authMiddleware, updateMarks);

export default router;
