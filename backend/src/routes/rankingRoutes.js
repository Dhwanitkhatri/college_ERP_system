// Ranking routes
import express from "express";
const router = express.Router();
const { getCourseRankings } = require("../controllers/rankingcontroller");
const { authMiddleware , adminMiddleware } = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes in this router
router.use(authMiddleware , adminMiddleware);

router.get("/", getCourseRankings);

export default router;