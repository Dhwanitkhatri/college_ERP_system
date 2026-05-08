import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getEventsByCourse,
  updateEvent,
  deleteEvent,
} from "../controllers/eventControllers.js";

const router = express.Router();

// CREATE event
router.post("/",authMiddleware, createEvent);

// READ events by course
router.get("/course/",  authMiddleware,getEventsByCourse);

// UPDATE event
router.put("/:id",authMiddleware, updateEvent);

// DELETE event
router.delete("/:id", authMiddleware,deleteEvent);

export default router;
