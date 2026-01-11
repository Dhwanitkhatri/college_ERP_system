// Session Planning Controller rr

import { SessionPlanning } from "../model/SessionPlanning.js";
import { Timetable } from "../model/Timetable.js";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";
import { Op } from "sequelize";
import { User } from "../model/User.js"
import { sequelize } from "../config/db.js";

const generatePlanId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SP-${timestamp}-${random}`;
};

export const createSessionPlan = async (req, res) => {
    try {
        const role = req.user.role;
        const user_id = req.user.uid;

        if (role !== "Faculty") {
            return res.status(400).json({
                success: false,
                message: "Access denied. Only faculty can access this information."
            });
        }

        // Get faculty ID from user
        const facultyUser = await User.findOne({
            where: { user_id: user_id },
            attributes: ['username']
        });

        if (!facultyUser) {
            return res.status(404).json({
                success: false,
                message: "Faculty user not found"
            });
        }

        const faculty_id = facultyUser.username;

        const {
            class_pk,
            subject_id,
            topics,
            lecture_no,
            date,
            status = "Pending",
        } = req.body;

        if (!class_pk || !subject_id || !topics || !lecture_no || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: class_pk, subject_id, topics, lecture_no, date"
            });
        }

        let subject_name = null;
        const sub = await Subject.findOne({
            where:{subject_id},
            attributes:['subject_name']
        })

        subject_name = sub.subject_name; 
        
        const dateObj = new Date(date);
        const dayOfWeek = getDayOfWeekFromDate(dateObj);

        // Check if faculty has lecture on this date
        const timetableEntry = await Timetable.findOne({
            where: {
                faculty_id,
                class_pk,
                subject_id,
                day_of_week: dayOfWeek
            },
            include: [
                {
                    model: Subject,
                    as: "subject",
                    attributes: ['subject_id', 'subject_name']
                },
                {
                    model: Class,
                    as: "class",
                    attributes: ['class_id']
                }
            ],
        });
        if (!timetableEntry) {
            return res.status(403).json({
                success: false,
                message: "You are not scheduled to teach this subject to this class on this date"
            });
        }


        // Check total lectures for this date
        const timetableEntries = await Timetable.findAll({
            where: {
                faculty_id,
                class_pk,
                subject_id,
                day_of_week: dayOfWeek
            },
            order: [['start_time', 'ASC']]
        });


        // Validate lecture number
        if (lecture_no < 1 || lecture_no > timetableEntries.length) {
            return res.status(400).json({
                success: false,
                message: `Invalid lecture number. You have ${timetableEntries.length} lecture(s) of this subject for this class on ${dayOfWeek}`,
                available_lectures: timetableEntries.map((entry, index) => ({
                    lecture_no: index + 1,
                    time: `${entry.start_time} - ${entry.end_time}`
                }))
            });
        }

        // Get the specific timetable entry for this lecture
        const specificTimetableEntry = timetableEntries[lecture_no - 1];

        // Check if plan already exists
        const existingPlan = await SessionPlanning.findOne({
            where: {
                faculty_id,
                class_pk,
                subject_id,
                lecture_no,
                date
            }
        });

        if (existingPlan) {
            console.log("Plan already exists:", existingPlan.plan_id);
            return res.status(400).json({
                success: false,
                message: `Session plan already exists for lecture ${lecture_no}`,
                data: {
                    existing_plan_id: existingPlan.plan_id,
                    topics: existingPlan.topics
                }
            });
        }

        // Generate UNIQUE plan ID
        const plan_id = generatePlanId();

        // Create session plan
        const sessionPlan = await SessionPlanning.create({
            plan_id,
            class_pk,
            subject_id,
            faculty_id,
            topics,
            lecture_no,
            date,
            status,
        });

        return res.status(201).json({
            success: true,
            message: `Session plan created for lecture ${lecture_no}`,
            data: {
                plan_id: sessionPlan.plan_id,
                faculty_id: sessionPlan.faculty_id,
                class: {
                    class_pk: sessionPlan.class_pk,
                    class_id: timetableEntry.class?.class_id || '',
                },
                subject: {
                    id: subject_id,
                    name: subject_name
                },
                date: sessionPlan.date,
                lecture_no: sessionPlan.lecture_no,
                time_slot: specificTimetableEntry ? 
                    `${specificTimetableEntry.start_time} - ${specificTimetableEntry.end_time}` : 'Unknown',
                topics: sessionPlan.topics,
                status: sessionPlan.status,
                created_at: sessionPlan.createdAt
            }
        });

    } catch (error) {
        console.error("Create session plan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
//get day of week from date
const getDayOfWeekFromDate = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
};

export const getFacultyTechInfo = async (req, res) => {
    try {
        const role = req.user.role;
        const user_id = req.user.uid;

        if (role !== "Faculty") {
            return res.status(400).json({
                success: false,
                message: "Access denied. Only faculty can access this information."
            });
        }

        // Get faculty ID from user
        const facultyUser = await User.findOne({
            where: { user_id: user_id },
            attributes: ['username']
        });

        if (!facultyUser) {
            return res.status(404).json({
                success: false,
                message: "Faculty user not found"
            });
        }

        const faculty_id = facultyUser.username;

        // Get academic year
        const currentClass = await Class.findOne({
            order: [["createdAt", "ASC"]],
            attributes: ["academic_year"],
        });

        const academicYear = currentClass?.academic_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
        // Use direct SQL query 
        const query = `
      SELECT 
        t.class_pk,
        t.subject_id,
        t.day_of_week,
        s.subject_name,
        c.class_id,
        c.semester,
        c.academic_year
      FROM timetables t
      LEFT JOIN subjects s ON t.subject_id = s.subject_id
      LEFT JOIN classes c ON t.class_pk = c.id
      WHERE t.faculty_id = ?
      ORDER BY t.class_pk, t.subject_id, t.day_of_week
    `;

        const timetableData = await sequelize.query(query, {
            replacements: [faculty_id],
            type: sequelize.QueryTypes.SELECT
        });

        if (!timetableData || timetableData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No teaching assignments found for this faculty",
                data: {
                    faculty_id,
                    academic_year: academicYear
                }
            });
        }

        // Group by class
        const teachingInfo = {};

        timetableData.forEach(row => {
            const classKey = row.class_pk;
            const subjectKey = row.subject_id;

            if (!teachingInfo[classKey]) {
                teachingInfo[classKey] = {
                    class_pk: row.class_pk,
                    class_id: row.class_id || '',
                    semester: row.semester || 1,
                    academic_year: row.academic_year || academicYear,
                    subjects: {}
                };
            }

            if (!teachingInfo[classKey].subjects[subjectKey]) {
                teachingInfo[classKey].subjects[subjectKey] = {
                    subject_id: row.subject_id,
                    subject_name: row.subject_name || 'Unknown Subject',
                    teaching_days: new Set()
                };
            }

            teachingInfo[classKey].subjects[subjectKey].teaching_days.add(row.day_of_week);
        });

        // Format response
        const formattedInfo = Object.values(teachingInfo).map(classInfo => {
            const subjectsArray = Object.values(classInfo.subjects).map(subject => ({
                subject_id: subject.subject_id,
                subject_name: subject.subject_name,
                teaching_days: Array.from(subject.teaching_days).sort()
            }));

            return {
                class: {
                    class_pk: classInfo.class_pk,
                    class_id: classInfo.class_id,
                    semester: classInfo.semester
                },
                subjects: subjectsArray
            };
        });

        return res.status(200).json({
            success: true,
            message: "Faculty teaching information retrieved successfully",
            data: {
                faculty_id: faculty_id,
                academic_year: academicYear,
                total_classes: formattedInfo.length,
                total_subjects: formattedInfo.reduce((sum, classInfo) => sum + classInfo.subjects.length, 0),
                teaching_info: formattedInfo
            }
        });

    } catch (error) {
        console.error("Get faculty teaching info error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
// GET - Get all session plans for faculty
export const getAllSessionPlans = async (req, res) => {
    try {
        const faculty_id = req.user.uid;

        // Get all session plans for this faculty
        const sessionPlans = await SessionPlanning.findAll({
            where: {
                faculty_id
            },
            include: [
                {
                    model: Subject,
                    attributes: ['subject_name']
                },
                {
                    model: Class,
                    attributes: ['class_id']
                }
            ],
            order: [
                ['date', 'DESC']
            ]
        });

        if (!sessionPlans.length) {
            return res.status(404).json({
                success: false,
                message: "No session plans found"
            });
        }

        // Simple response format
        const formattedPlans = sessionPlans.map(plan => ({
            plan_id: plan.plan_id,
            class_id: plan.class_id,
            subject_name: plan.subject?.subject_name || 'Unknown',
            date: plan.date,
            lecture_no: plan.lecture_no,
            topics: plan.topics,
            status: plan.status,
            created_at: plan.createdAt
        }));

        // Count plans by status
        const plannedCount = sessionPlans.filter(p => p.status === "Planned").length;
        const completedCount = sessionPlans.filter(p => p.status === "Completed").length;
        const pendingCount = sessionPlans.filter(p => p.status === "Pending").length;

        return res.status(200).json({
            success: true,
            message: `Found ${sessionPlans.length} session plans`,
            data: {
                total_plans: sessionPlans.length,
                plans: formattedPlans,
                summary: {
                    planned: plannedCount,
                    completed: completedCount,
                    pending: pendingCount
                }
            }
        });

    } catch (error) {
        console.error("Get all session plans error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};