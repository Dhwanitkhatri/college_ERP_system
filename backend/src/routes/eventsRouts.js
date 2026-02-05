import express from "express";
import {
  createEvent,
  getEventsByCourse,
  updateEvent,
  deleteEvent,
} from "../controllers/eventControllers.js";

const router = express.Router();

// CREATE event
router.post("/", createEvent);

// READ events by course
router.get("/course/:course_id", getEventsByCourse);

// UPDATE event
router.put("/:id", updateEvent);

// DELETE event
router.delete("/:id", deleteEvent);

export default router;
