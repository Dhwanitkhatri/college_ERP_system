import express from "express";
import { enterMarks } from "../controllers/marksController.js";

const router = express.Router();

router.post("/enter-marks", enterMarks);

export default router;
