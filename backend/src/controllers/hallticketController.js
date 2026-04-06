import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Exam } from "../model/Exam.js";
import { ExamTimetable } from "../model/ExamTimetable.js";
import { Student } from "../model/Student.js";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";
import { number } from "zod";

// ==========================================
// GENERATE HALL TICKETS (Admin only) – POST with body filters
// ==========================================
export const generateHallTickets = async (req, res) => {
  try {
    const { academic_year, semester, exam_id, exam_type } = req.body;
    const course_id = req.user?.course_id;

    if (req.user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: "Access denied: Admin only" });
    }
    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    // Build exam filter
    const examWhere = { course_id };
    if (exam_id) examWhere.exam_id = exam_id;
    if (exam_type) examWhere.exam_type = exam_type;

    // Get exams that match the filter (academic_year and semester are not in Exam table – they will be used via Class later)
    const exams = await Exam.findAll({ where: examWhere });

    if (!exams.length) {
      return res.status(404).json({ success: false, message: "No exams found matching the criteria" });
    }

    const hallTickets = [];

    for (const exam of exams) {
      // Build student filter: students in this semester and course, optionally filtered by academic_year
      const classWhere = { course_id, semester: exam.semester };
      if (academic_year) classWhere.academic_year = academic_year;

      const students = await Student.findAll({
        include: [
          {
            model: Class,
            where: classWhere,
            required: true,
            attributes: ["class_id", "section", "academic_year"]
          }
        ],
        attributes: ["student_id", "name", "enrollment_no"]
      });

      if (!students.length) continue;

      // Fetch timetable for this exam
      const timetable = await ExamTimetable.findAll({
        where: { exam_id: exam.exam_id },
        include: [
          {
            model: Subject,
            where: { course_id },
            attributes: ["subject_id", "subject_name", "credit"]
          }
        ],
        order: [["exam_date", "ASC"], ["start_time", "ASC"]]
      });

      if (!timetable.length) continue;

      // Build hall tickets for each student
      students.forEach(student => {
        hallTickets.push({
          student: {
            student_id: student.student_id,
            name: student.name,
            enrollment_no: student.enrollment_no,
            class: student.Class?.class_id,
            section: student.Class?.section,
            academic_year: student.Class?.academic_year
          },
          exam: {
            exam_id: exam.exam_id,
            name: exam.name,
            exam_type: exam.exam_type,
            semester: exam.semester
          },
          schedule: timetable.map(entry => ({
            subject_id: entry.Subject.subject_id,
            subject_name: entry.Subject.subject_name,
            credits: entry.Subject.credit,
            exam_date: entry.exam_date,
            start_time: entry.start_time,
            end_time: entry.end_time
          }))
        });
      });
    }

    if (!hallTickets.length) {
      return res.status(404).json({ success: false, message: "No hall tickets found for the given criteria" });
    }

    res.json({ success: true, data: hallTickets });
  } catch (error) {
    console.error("Error generating hall tickets:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET LOGGED-IN STUDENT'S HALL TICKETS WITH FILTERS
// ==========================================
export const getMyHallTickets = async (req, res) => {
  try {
    const user_id = req.user?.uid;
    let { academic_year, semester, exam_type, exam_id } = req.query;

    // =========================
    // AUTH CHECK
    // =========================
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user?.role !== "Student") {
      return res.status(403).json({ success: false, message: "Access denied: Students only" });
    }

    // =========================
    // GET STUDENT
    // =========================
    const student = await Student.findOne({
      where: { user_id },
      include: [
        {
          model: Class,
          attributes: ["semester", "class_id", "section", "course_id", "academic_year"]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    const course_id = student.Class?.course_id;

    if (!course_id) {
      return res.status(400).json({ success: false, message: "Student not assigned to course" });
    }

    // =========================
    // VALIDATION (Dropdown Required)
    // =========================
    if (!exam_id && (!semester || !academic_year || !exam_type)) {
      return res.status(400).json({
        success: false,
        message: "semester, academic_year and exam_type are required"
      });
    }

    // =========================
    // BUILD EXAM FILTER
    // =========================
    const examWhere = {
      course_id,
      //status: "PUBLISHED"
    };

    if (exam_id) {
      examWhere.exam_id = Number(exam_id);
    } else {
      examWhere.semester = Number(semester);
      examWhere.academic_year = academic_year;
      examWhere.exam_type = exam_type;
    }

    // =========================
    // GET EXAMS
    // =========================
    const exams = await Exam.findAll({ where: examWhere });

    if (!exams.length) {
      return res.status(404).json({
        success: false,
        message: "No exams found"
      });
    }

    const hallTickets = [];

    // =========================
    // LOOP EXAMS
    // =========================
    for (const exam of exams) {

      const timetable = await ExamTimetable.findAll({
        where: { exam_id: exam.exam_id },
        include: [
          {
            model: Subject,
            where: { course_id },
            attributes: ["subject_id", "subject_name", "credit"]
          }
        ],
        order: [["exam_date", "ASC"], ["start_time", "ASC"]]
      });

      if (!timetable.length) continue;

      hallTickets.push({
        student: {
          student_id: student.student_id,
          name: student.name,
          enrollment_no: student.enrollment_no,
          class: student.Class?.class_id,
          section: student.Class?.section,
          academic_year: academic_year
        },
        exam: {
          exam_id: exam.exam_id,
          name: exam.name,
          exam_type: exam.exam_type,
          semester: exam.semester,
          academic_year: exam.academic_year
        },
        schedule: timetable.map(entry => ({
          subject_id: entry.Subject.subject_id,
          subject_name: entry.Subject.subject_name,
          credits: entry.Subject.credit,
          exam_date: entry.exam_date,
          start_time: entry.start_time,
          end_time: entry.end_time
        }))
      });
    }

    // =========================
    // FINAL RESPONSE
    // =========================
    if (!hallTickets.length) {
      return res.status(404).json({
        success: false,
        message: "No hall tickets found"
      });
    }

    return res.status(200).json({
      success: true,
      count: hallTickets.length,
      data: hallTickets
    });

  } catch (error) {
    console.error("Error fetching hall tickets:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getExamsBySemesterAndAcademic = async (req, res) => {
  try {
    const { semester, academic_year  , exam_type} = req.query;
    const course_id = req.user.course_id;

    if (!semester || !academic_year || !exam_type) {
      return res.status(400).json({
        message: "semester and academic_year are required",
      });
    }

    const exams = await Exam.findAll({
      where: {
        semester: semester,
        academic_year: academic_year,
        course_id,
       
        exam_type:exam_type
      },
      attributes: [
        "exam_id",
        "name",       
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
