//timetable controller
import { Timetable } from "../model/Timetable.js";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";
import { Faculty } from "../model/Faculty.js";
import { sequelize } from "../config/db.js";
import { Op, fn, col } from "sequelize";
import {
  getCurrentAcademicYear,
  getSemesterType,
} from "../services/academicYear.js";

// Create a new timetable entry (admin only)
export const createTimetableEntry = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      class_id,
      subject_id,
      faculty_id,
      day_of_week,
      start_time,
      end_time,
    } = req.body;

    console.log("Received data:", req.body);
    const course_id = req.user.course_id;
    const course = course_id.replace(/\d/g, "");
    const schedule_id = `SCHD-${Date.now()}-${course}`;

    // Required fields validation
    if (!class_id || !subject_id || !faculty_id || !day_of_week || !start_time || !end_time) {
      await t.rollback();
      return res.status(400).json({ message: "All fields are required" });
    }

    // Day validation
    const validDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    if (!validDays.includes(day_of_week)) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid day_of_week value" });
    }

    // Foreign key validation
  const classExists = await Class.findOne({
  where: { id: Number(class_id) }
});
    const subjectExists = await Subject.findOne({ where: { subject_id } });
   
    const facultyExists = await Faculty.findOne({ where: { faculty_id } });
    if (!classExists || !subjectExists || !facultyExists) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid class, subject, or faculty ID" });
    }

    // Class time conflict
    const classConflict = await Timetable.findOne({
      where: {
        class_pk: class_id,
        day_of_week,
        [Op.or]: [
          { start_time: { [Op.between]: [start_time, end_time] } },
          { end_time: { [Op.between]: [start_time, end_time] } },
          { [Op.and]: [{ start_time: { [Op.lte]: start_time } }, { end_time: { [Op.gte]: end_time } }] }
        ]
      },
      transaction: t
    });

    if (classConflict) {
      await t.rollback();
      return res.status(400).json({ message: "Class has a conflicting lecture" });
    }

    // Faculty time conflict
    const facultyConflict = await Timetable.findOne({
      where: {
        faculty_id,
        day_of_week,
        [Op.or]: [
          { start_time: { [Op.between]: [start_time, end_time] } },
          { end_time: { [Op.between]: [start_time, end_time] } },
          { [Op.and]: [{ start_time: { [Op.lte]: start_time } }, { end_time: { [Op.gte]: end_time } }] }
        ]
      },
      transaction: t
    });

    if (facultyConflict) {
      await t.rollback();
      return res.status(400).json({ message: "Faculty has a conflicting lecture" });
    }

    //  Create timetable entry
    const newEntry = await Timetable.create({
      schedule_id,
      class_pk: Number(class_id),
      subject_id,
      faculty_id,
      day_of_week,
      start_time,
      end_time
    }, { transaction: t });

    await t.commit();
    return res.status(201).json({ message: "Timetable entry created", entry: newEntry });

  } catch (error) {
    await t.rollback();

    // Sequelize-specific errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Schedule ID already exists" });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map(err => err.message)
      });
    }

    console.error("Error creating timetable entry:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

//Get all timetable entries
export const getAllTimetableEntries = async (req, res) => {
  try {
    const timetables = await Timetable.findAll({
      order: [
        ["day_of_week", "ASC"],
        ["start_time", "ASC"],
      ],
    });
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get timetable for a specific class
export const getTimetableByClass = async (req, res) => {
  try {
    const { class_pk } = req.params;

    const timetable = await Timetable.findAll({
      where: { class_pk },
      include: [
        { model: Faculty, attributes: ["name"] },
        { model: Subject, attributes: ["subject_name"] }
      ],
      order: [
        ["day_of_week", "ASC"],
        ["start_time", "ASC"]
      ],
      attributes:{
         exclude: [
      "id",
      "schedule_id",
      "class_pk",
      "subject_id",
      "faculty_id",
      "createdAt",
      "updatedAt",
      
    ]
      }
    });

    // Group by day
    const weekTimetable = timetable.reduce((acc, item) => {
      const day = item.day_of_week;

      if (!acc[day]) acc[day] = [];
      acc[day].push(item);

      return acc;
    }, {});

    res.json(weekTimetable);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get timetable for a specific faculty member
export const getTimetableByFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({where:{user_id : req.user.uid}});
    const timetable = await Timetable.findAll({
      where: { faculty_id :faculty.faculty_id },
      order: [
        ["day_of_week", "ASC"],
        ["start_time", "ASC"],
      ],
    });
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get available time slots for a class on a specific day
export const getAvailableTimeSlots = async (req, res) => {
  try {
    let { class_id, day_of_week } = req.params;

    // 🔧 fix day_of_week
    day_of_week = day_of_week.replace(/"/g, "");

    const allTimeSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    const occupiedSlots = await Timetable.findAll({
      where: { class_pk: class_id, day_of_week },
      attributes: ["start_time", "end_time"],
    });

    const occupiedTimes = new Set();

    occupiedSlots.forEach((slot) => {
      const startHour = parseInt(slot.start_time.split(":")[0], 10);
      const endHour = parseInt(slot.end_time.split(":")[0], 10);
      const endMinute = parseInt(slot.end_time.split(":")[1], 10);

      // mark start hour as occupied
      occupiedTimes.add(`${startHour.toString().padStart(2, "0")}:00`);

      // if class spans to next hour
      if (endMinute > 0 && endHour > startHour) {
        for (let h = startHour + 1; h <= endHour; h++) {
          occupiedTimes.add(`${h.toString().padStart(2, "0")}:00`);
        }
      }
    });

    const slotsWithStatus = allTimeSlots.map((time) => ({
      time,
      status: occupiedTimes.has(time) ? "occupied" : "available",
    }));

    return res.status(200).json({
      class_id,
      day_of_week,
      slots: slotsWithStatus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Update a timetable entry(admin only)
export const updateTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      schedule_id,
      class_id,
      subject_id,
      faculty_id,
      day_of_week,
      start_time,
      end_time,
    } = req.body;
    //validation to require fields
    if (
      !schedule_id &&
      !class_id &&
      !subject_id &&
      !faculty_id &&
      !day_of_week &&
      !start_time &&
      !end_time
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    const entry = await Timetable.findByPk(id);
    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    //update only provided fields
    const updateData = {};
    const fields = [
      "schedule_id",
      "class_id",
      "subject_id",
      "faculty_id",
      "day_of_week",
      "start_time",
      "end_time",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    await entry.update(updateData);
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a timetable entry(admin only)
export const deleteTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByPk(id);
    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    await entry.destroy();
    res.status(200).json({ message: "Timetable entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCurrentYearClasses = async (req, res) => {
  try {
    const academic_year = getCurrentAcademicYear();
    const sem_type = getSemesterType();

    const semesterCondition = sem_type === "odd" ? [1, 3, 5] : [2, 4, 6];

    const classes = await Class.findAll({
      where: {
        academic_year,
        semester: { [Op.in]: semesterCondition },
        course_id : req.user.course_id
      },
      attributes: ["id", "class_id", "semester"],
    });

    res.json({
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubject = async (req, res) => {
  const course_id = req.user.course_id; //assuming course_id is stored in user's
  const {semester} = req.query; //assuming semester is passed as query
console.log(semester);
  try {
    const subjects = await Subject.findAll({
      attributes: ["subject_id", "subject_name"],
      where: {semester ,course_id} // or just semester (ES6 shorthand)
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFaculty = async (req, res) => {
    const course_id = req.user.course_id; //assuming course_id is stored in user's
  try {
    const faculties = await Faculty.findAll({
      attributes: ["faculty_id", "name"],
      where: { course_id } // ES6 shorthand
    });
    res.status(200).json(faculties);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};