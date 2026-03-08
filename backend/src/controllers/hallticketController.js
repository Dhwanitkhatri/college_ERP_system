import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Exam } from "../model/Exam.js";
import { ExamTimetable } from "../model/ExamTimetable.js";
import { Student } from "../model/Student.js";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";

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

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (req.user?.role !== 'Student') {
      return res.status(403).json({ success: false, message: "Access denied: Students only" });
    }

    // Get student with class details
    const student = await Student.findOne({
      where: { user_id },
      include: [{ model: Class, attributes: ["semester", "class_id", "section", "course_id", "academic_year"] }]
    });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }
    const course_id = student.Class?.course_id;
    const studentSemester = student.Class?.semester;
    const studentAcademicYear = student.Class?.academic_year;
    if (!course_id || !studentSemester || !studentAcademicYear) {
      return res.status(400).json({ success: false, message: "Student not fully assigned to a class" });
    }

    // Default to student's current academic year and semester if not provided
    if (!academic_year) academic_year = studentAcademicYear;
    if (!semester) semester = studentSemester;

    // Build exam filter
    const examWhere = { course_id };
    if (exam_id) {
      examWhere.exam_id = exam_id;
    } else {
      examWhere.semester = parseInt(semester);
      if (exam_type) examWhere.exam_type = exam_type;
    }

    const exams = await Exam.findAll({ where: examWhere });

    if (!exams.length) {
      return res.status(404).json({ success: false, message: "No exams found matching the criteria" });
    }

    const hallTickets = [];

    for (const exam of exams) {
      // For each exam, check if it belongs to the student's semester (already filtered) and academic year (implicitly via class)
      // We'll proceed; academic year is not in exam, but we already set it via student's class.

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
          academic_year: studentAcademicYear
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
    }

    if (!hallTickets.length) {
      return res.status(404).json({ success: false, message: "No hall tickets found for the given filters" });
    }

    res.json({ success: true, data: hallTickets });
  } catch (error) {
    console.error("Error fetching hall tickets:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};