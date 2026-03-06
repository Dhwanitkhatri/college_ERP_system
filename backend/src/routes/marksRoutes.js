import express from "express";
import { enterMarks , updateMarks , bulkEnterMarks } from "../controllers/marksController.js";
import { authMiddleware ,adminMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/enter-marks", authMiddleware,adminMiddleware, enterMarks);
router.post("/bulk-enter-marks", authMiddleware,adminMiddleware, bulkEnterMarks);
router.put("/update-marks", authMiddleware,adminMiddleware, updateMarks);

export default router;
