// Session Planning Controller

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
           
        } = req.body;
        console.log(req.body);
         const status = "Pending";
        if (!class_pk || !subject_id || !topics || !lecture_no || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: class_pk, subject_id, topics, lecture_no, date"
            });
        }

        let subject_name = null;
        const sub = await Subject.findOne({
            where: { subject_id },
            attributes: ['subject_name']
        });
        
        if (!sub) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        subject_name = sub.subject_name;

        const dateObj = new Date(date);
        const dayOfWeek = getDayOfWeekFromDate(dateObj);
        console.log(dayOfWeek);
        // Check if faculty has lecture on this date
        const timetableEntry = await Timetable.findOne({
            where: {
                faculty_id,
                class_pk:class_pk,
                subject_id,
                day_of_week: dayOfWeek
            },
            include: [
                {
                    model: Subject,
                    attributes: ['subject_id', 'subject_name']
                },
                {
                    model: Class,
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
                    class_id: timetableEntry.Class?.class_id || '',
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
            class_id: plan.Class?.class_id || 'Unknown',
            subject_name: plan.Subject?.subject_name || 'Unknown',
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
export const getFacultyScheduleForDate = async (req, res) => {
    try {
        const role = req.user.role;
        const user_id = req.user.uid;
        const { date } = req.query;

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

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        const dateObj = new Date(date);
        const dayOfWeek = getDayOfWeekFromDate(dateObj);

        // Get the academic year FROM THE DATE (not current year)
        const year = dateObj.getFullYear();
        let academicYear;

        // Assuming academic year runs from June to May
        if (dateObj.getMonth() >= 5) { // June to December
            academicYear = `${year}-${year + 1}`;
        } else { // January to May
            academicYear = `${year - 1}-${year}`;
        }


        // Get faculty timetable for that day AND academic year
        const timetableEntries = await Timetable.findAll({
            where: {
                faculty_id,
                day_of_week: dayOfWeek
            },
            include: [
                {
                    model: Subject,
                    attributes: ['subject_id', 'subject_name']
                },
                {
                    model: Class,
                    where: {
                        academic_year: academicYear
                    },
                    required: false,
                    attributes: ['class_id', 'semester', 'academic_year']
                }
            ],
            order: [
                ['class_pk', 'ASC'],
                ['start_time', 'ASC']
            ]
        });


        // Get existing plans for this date
        const existingPlans = await SessionPlanning.findAll({
            where: {
                faculty_id,
                date: date
            },
            include: [
                {
                    model: Subject,
                    attributes: ['subject_name']
                },
                {
                    model: Class,
                    attributes: ['class_id', 'academic_year']
                }
            ]
        });


        // If no timetable entries
        if (timetableEntries.length === 0) {
            // Check if plans exist without timetable
            const plansWithoutTimetable = existingPlans.filter(plan => {
                return !timetableEntries.some(entry =>
                    entry.class_pk === plan.class_pk &&
                    entry.subject_id === plan.subject_id
                );
            });

            return res.status(200).json({
                success: true,
                message: "No timetable entries found for this date",
                data: {
                    date: date,
                    day_of_week: dayOfWeek,
                    academic_year: academicYear,
                    note: "No classes scheduled in timetable",
                    existing_plans: plansWithoutTimetable.length > 0 ? {
                        count: plansWithoutTimetable.length,
                        plans: plansWithoutTimetable.map(plan => ({
                            plan_id: plan.plan_id,
                            class_id: plan.Class?.class_id,
                            subject_name: plan.Subject?.subject_name,
                            lecture_no: plan.lecture_no,
                            topics: plan.topics,
                            status: plan.status
                        }))
                    } : null,
                    suggestion: plansWithoutTimetable.length > 0 ?
                        "Session plans exist but timetable may have changed" :
                        "No session plans found"
                }
            });
        }

        // Group subject and class (same as before)
        const scheduleByClassSubject = {};

        timetableEntries.forEach(entry => {
            const key = `${entry.class_pk}_${entry.subject_id}`;

            if (!scheduleByClassSubject[key]) {
                scheduleByClassSubject[key] = {
                    class_pk: entry.class_pk,
                    class_id: entry.Class?.class_id || '',
                    semester: entry.Class?.semester || 1,
                    academic_year: entry.Class?.academic_year || academicYear,
                    subject_id: entry.subject_id,
                    subject_name: entry.Subject?.subject_name || '',
                    lecture_slots: []
                };
            }

            const lectureNo = scheduleByClassSubject[key].lecture_slots.length + 1;
            scheduleByClassSubject[key].lecture_slots.push({
                schedule_id: entry.schedule_id,
                start_time: entry.start_time,
                end_time: entry.end_time,
                lecture_no: lectureNo,
                time_slot: `${entry.start_time} - ${entry.end_time}`
            });
        });

        // Create plan map
        const planMap = {};
        existingPlans.forEach(plan => {
            const key = `${plan.class_pk}_${plan.subject_id}_${plan.lecture_no}`;
            planMap[key] = plan;
        });

        // Format response
        const formattedSchedule = Object.values(scheduleByClassSubject).map(item => {
            const updatedLectureSlots = item.lecture_slots.map(slot => {
                const key = `${item.class_pk}_${item.subject_id}_${slot.lecture_no}`;
                const existingPlan = planMap[key];

                return {
                    ...slot,
                    has_plan: !!existingPlan,
                    plan_details: existingPlan ? {
                        plan_id: existingPlan.plan_id,
                        topics: existingPlan.topics,
                        status: existingPlan.status
                    } : null
                };
            });

            const plannedLectures = updatedLectureSlots.filter(s => s.has_plan).length;

            return {
                class: {
                    class_pk: item.class_pk,
                    class_id: item.class_id,
                    semester: item.semester,
                    academic_year: item.academic_year
                },
                subject: {
                    subject_id: item.subject_id,
                    subject_name: item.subject_name,
                },
                lecture_slots: updatedLectureSlots,
                total_lectures: updatedLectureSlots.length,
                planned_lectures: plannedLectures
            };
        });

        // Calculate summary
        const totalLectures = timetableEntries.length;
        const totalPlannedLectures = existingPlans.length;
        const pendingLectures = Math.max(0, totalLectures - totalPlannedLectures);

        return res.status(200).json({
            success: true,
            message: "Faculty schedule retrieved successfully",
            data: {
                date: date,
                day_of_week: dayOfWeek,
                academic_year: academicYear,
                schedule: formattedSchedule,
                summary: {
                    total_classes: formattedSchedule.length,
                    total_lectures: totalLectures,
                    planned_lectures: totalPlannedLectures,
                    pending_lectures: pendingLectures
                }
            }
        });

    } catch (error) {
        console.error("Get faculty schedule error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//update session plan status
export const updateSessionPlan = async (req, res) => {
    try {
        const role = req.user.role;
        const { plan_id } = req.params;
        const user_id = req.user.uid;

        if (role !== "Faculty") {
            return res.status(400).json({
                success: false,
                message: "Access denied. Only faculty can access this information."
            });
        }

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

        // find session plan
        const sessionPlan = await SessionPlanning.findOne({
            where: {
                plan_id,
                faculty_id
            }
        });
        if (!sessionPlan) {
            return res.status(404).json({
                success: false,
                message: "Session plan not found"
            });
        }
        const {
            topics,
            lecture_no,
            date,
            status
        } = req.body;

        const updatedLectureNo = lecture_no ?? sessionPlan.lecture_no;
        const updateDate = date ?? sessionPlan.date;

        if (lecture_no || date) {
            const dateObj = new Date(updateDate);
            const dayOfWeek = getDayOfWeekFromDate(dateObj);

            const timetableEntries = await Timetable.findAll({
                where: {
                    faculty_id,
                    class_pk: sessionPlan.class_pk,
                    subject_id: sessionPlan.subject_id,
                    day_of_week: dayOfWeek
                },
                order: [['start_time', 'ASC']]
            });

            if (!timetableEntries.length) {
                return res.status(400).json({
                    success: false,
                    message: "No lectures scheduled for the updated date"
                });
            }
            const duplicatePlan = await SessionPlanning.findOne({
                where: {
                    faculty_id,
                    class_pk: sessionPlan.class_pk,
                    subject_id: sessionPlan.subject_id,
                    lecture_no: updatedLectureNo,
                    date: updateDate,
                    plan_id: { [Op.ne]: plan_id }
                }
            });

            if (duplicatePlan) {
                return res.status(400).json({
                    success: false,
                    message: "Another session plan already exists for this lecture and date"
                });
            }


            if (updatedLectureNo < 1 || updatedLectureNo > timetableEntries.length) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid lecture number for the updated date. You have ${timetableEntries.length} lecture(s) of this subject for this class on ${dayOfWeek}`
                });
            }
        }

        // Update Fields
        await sessionPlan.update({
            topics: topics ?? sessionPlan.topics,
            lecture_no: updatedLectureNo,
            date: updateDate,
            status: status ?? sessionPlan.status
        });
        return res.status(200).json({
            success: true,
            message: "Session plan updated successfully",
            data: {
                plan_id: sessionPlan.plan_id,
                topics: sessionPlan.topics,
                lecture_no: sessionPlan.lecture_no,
                date: sessionPlan.date,
                status: sessionPlan.status
            }
        });
    } catch (error) {
        console.error("Update session plan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete session plan
export const deleteSessionPlan = async (req, res) => {
    try {
        const role = req.user.role;
        const user_id = req.user.uid;
        const { plan_id } = req.params;

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

        // Find session plan
        const sessionPlan = await SessionPlanning.findOne({
            where: {
                plan_id,
                faculty_id
            }
        });
        if (!sessionPlan) {
            return res.status(404).json({
                success: false,
                message: "Session plan not found"
            });
        }

        const deletedData = {
            plan_id: sessionPlan.plan_id,
            class_pk: sessionPlan.class_pk,
            subject_id: sessionPlan.subject_id,
            lecture_no: sessionPlan.lecture_no,
            date: sessionPlan.date,
            topics: sessionPlan.topics,
            status: sessionPlan.status
        };
        await sessionPlan.destroy();
        return res.status(200).json({
            success: true,
            message: "Session plan deleted successfully",
            data: deletedData
        });
    }
    catch (error) {
        console.error("Delete session plan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};