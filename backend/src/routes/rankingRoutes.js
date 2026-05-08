// Ranking routes
import express from "express";
const router = express.Router();
import { generateRankings } from "../controllers/rankingController.js";
import { authMiddleware , adminMiddleware} from '../middleware/authMiddleware.js';

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", generateRankings);

export default router;