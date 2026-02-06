import { Event } from "../model/Event.js";
import { Course } from "../model/Course.js";

//create events
export const createEvent = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      event_date,
      event_time,
      location,
      attendees = 0,
    } = req.body;
    const course_id = req.user.course_id;
    // Validate required fields
    if (
      !course_id ||
      !category ||
      !title ||
      !event_date ||
      !event_time ||
      !location
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate category
    const validCategories = ["culture", "academic", "sports"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const event = await Event.create({
      course_id,
      category,
      title,
      description,
      event_date,
      event_time,
      location,
      attendees,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get events by course
export const getEventsByCourse = async (req, res) => {
  try {
    const course_id = req.user.course_id;
    console.log(course_id);
    const events = await Event.findAll({
      where: { course_id },
      order: [["event_date", "ASC"]],
      attributes: {
        exclude: ["course_id", "createdAt", "updatedAt"],
      },
    });

    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//update events
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only allow these fields to be updated
    const allowedFields = [
      "category",
      "title",
      "description",
      "event_date",
      "event_time",
      "location",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    await event.update(updateData);

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete events
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.destroy();

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
