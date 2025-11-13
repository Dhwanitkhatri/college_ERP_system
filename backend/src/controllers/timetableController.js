//timetable controller
import { Timetable } from '../model/Timetable.js';
import { Class } from '../model/Class.js';
import { Subject } from '../model/Subject.js';
import { Faculty } from '../model/Faculty.js';
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";

// Create a new timetable entry(admin only)
export const createTimetableEntry = async (req, res) => {
    try {
        const t = await sequelize.transaction(); //start transaction    
        const { schedule_id, class_id, subject_id, faculty_id, day_of_week, start_time, end_time } = req.body;

        //validation to require fields
        if (
            !schedule_id ||
            !class_id ||
            !subject_id ||
            !faculty_id ||
            !day_of_week ||
            !start_time ||
            !end_time
        ) {
            await t.rollback();
            return res.status(400).json({ message: "All fields are required" });
        }

        //validation to check if schedule_id already exists
        const existingSchedule = await Timetable.findOne({ where: { schedule_id } });
        if (existingSchedule) {
            await t.rollback();
            return res.status(400).json({ message: "Schedule ID already exists" });
        }

        //validate day_of_week
        const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        if (!validDays.includes(day_of_week)) {
            await t.rollback();
            return res.status(400).json({ message: "Invalid day_of_week value" });
        }

        // Validate foreign keys
        const classExists = await Class.findByPk(class_id);
        const subjectExists = await Subject.findByPk(subject_id);
        const facultyExists = await Faculty.findByPk(faculty_id);
        if (!classExists || !subjectExists || !facultyExists) {
            return res.status(400).json({ message: 'Invalid class, subject, or faculty ID' });
        }

        // Check for time conflicts
        const classConflict = await Timetable.findOne({
            where: {
                class_id,
                day_of_week,
                [Op.or]: [
                    {
                        start_time: { [Op.between]: [start_time, end_time] }
                    },
                    {
                        end_time: { [Op.between]: [start_time, end_time] }
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: start_time } },
                            { end_time: { [Op.gte]: end_time } }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: Faculty,
                    attributes: ['name']
                },
                {
                    model: Subject,
                    attributes: ['subject_name']
                }
            ],
            transaction: t
        });

        if (classConflict) {
            await t.rollback();
            return res.status(400).json({
                message: "This class already has another lecture during this time slot",
                conflict: {
                    class: classExists.class_name,
                    existing_schedule: {
                        day: classConflict.day_of_week,
                        time: `${classConflict.start_time} - ${classConflict.end_time}`,
                        faculty: classConflict.Faculty?.name,
                        subject: classConflict.Subject?.subject_name
                    },
                    attempted_schedule: {
                        day: day_of_week,
                        time: `${start_time} - ${end_time}`
                    }
                },
            });
        }

        //check faculty time conflict
        const facultyConflict = await Timetable.findOne({
            where: {
                faculty_id,
                day_of_week,
                [Op.or]: [
                    {
                        start_time: { [Op.between]: [start_time, end_time] }
                    },
                    {
                        end_time: { [Op.between]: [start_time, end_time] }
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: start_time } },
                            { end_time: { [Op.gte]: end_time } }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: Class,
                    attributes: ['class_name']
                },
                {
                    model: Subject,
                    attributes: ['subject_name']
                }
            ],
            transaction: t
        });
        if (facultyConflict) {
            await t.rollback();
            return res.status(400).json({
                message: "This faculty member has another lecture during this time slot",
                conflict: {
                    faculty: facultyExists.name,
                    existing_schedule: {
                        day: facultyConflict.day_of_week,
                        time: `${facultyConflict.start_time} - ${facultyConflict.end_time}`,
                        class: facultyConflict.Class?.class_name,
                        subject: facultyConflict.Subject?.subject_name
                    },
                    attempted_schedule: {
                        day: day_of_week,
                        time: `${start_time} - ${end_time}`
                    }
                },
            });
        }

        const newEntry = await Timetable.create({
            schedule_id,
            class_id,
            subject_id,
            faculty_id,
            day_of_week,
            start_time,
            end_time
        }, { transaction: t });
        res.status(201).json(newEntry);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            message: "Schedule ID already exists"
        });
    }

    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors.map(err => err.message)
        });
    }
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};
//Get all timetable entries
export const getAllTimetableEntries = async (req, res) => {
    try {
        const timetables = await Timetable.findAll({
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get timetable for a specific class
export const getTimetableByClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        const timetable = await Timetable.findAll({
            where: { class_id },
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
        res.status(200).json(timetable);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get timetable for a specific faculty member
export const getTimetableByFaculty = async (req, res) => {
    try {
        const { faculty_id } = req.params;
        const timetable = await Timetable.findAll({
            where: { faculty_id },
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
        res.status(200).json(timetable);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//get available time slots for a class on a specific day
export const getAvailableTimeSlots = async (req, res) => {
    try {
        const { class_id, day_of_week } = req.params;
        const allTimeSlots = [
            "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00",
            "17:00"
        ];
        const occupiedSlots = await Timetable.findAll({
            where: { class_id, day_of_week },
            attributes: ['start_time', 'end_time']
        });
        const occupiedTimes = occupiedSlots.flatMap(slot => {
            const start = parseInt(slot.start_time.split(':')[0], 10);
            const end = parseInt(slot.end_time.split(':')[0], 10);
            const times = [];
            for (let i = start; i < end; i++) {
                times.push(`${i.toString().padStart(2, '0')}:00`);
            }
            return times;
        });
        const availableSlots = allTimeSlots.filter(time => !occupiedTimes.includes(time));
        res.status(200).json({ availableSlots });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const entry = await Timetable.findByPk(id);
        if (!entry) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }
        //update only provided fields
        const updateData = {};
        const fields = ['schedule_id', 'class_id', 'subject_id', 'faculty_id', 'day_of_week', 'start_time', 'end_time'];

        for (const field of fields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }
        await entry.update(updateData);
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a timetable entry(admin only)
export const deleteTimetableEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Timetable.findByPk(id);
        if (!entry) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }
        await entry.destroy();
        res.status(200).json({ message: 'Timetable entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

