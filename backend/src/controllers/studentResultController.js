import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Student } from "../model/Student.js";
import { SemesterResult } from "../model/SemesterResult.js";
import { SubjectResult } from "../model/SubjectResult.js";
import { Exam } from "../model/Exam.js";
import { Subject } from "../model/Subject.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { StudentMarks } from "../model/StudentMarks.js";

// ==========================================
// GET ALL SEMESTER RESULTS FOR LOGGED-IN STUDENT
// ==========================================
export const getMyResults = async (req, res) => {
  try {
    const user_id = req.user?.uid; // from auth middleware (user_id from User table)
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Optional: check role if needed – assume only students call this
    if (req.user?.role !== 'Student') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Find the student record using user_id
    const student = await Student.findOne({ where: {  user_id } });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }
    const student_id = student.student_id;
    

    // Fetch all semester results for this student
    const semesterResults = await SemesterResult.findAll({
      where: { student_id },
      include: [
        {
          model: Exam,
          attributes: ["exam_id", "name", "exam_type", "semester", "academic_year"]
        }
      ],
      order: [
        [{ model: Exam }, "semester", "DESC"],
        [{ model: Exam }, "exam_type", "ASC"]
      ]
    });

    if (!semesterResults.length) {
      return res.json({ success: true, data: [] });
    }

    // Group by semester for easier frontend display
    const grouped = {};
    semesterResults.forEach(sr => {
      const sem = sr.Exam.semester;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push({
        exam_id: sr.Exam.exam_id,
        exam_name: sr.Exam.name,
        exam_type: sr.Exam.exam_type,
        academic_year: sr.Exam.academic_year,
        sgpa: sr.sgpa,
        cgpa: sr.cgpa,
        result_status: sr.result_status,
        total_credits: sr.total_credits,
        earned_credits: sr.earned_credits
      });
    });

    // Convert to array for response
    const result = Object.keys(grouped).map(sem => ({
      semester: parseInt(sem),
      exams: grouped[sem]
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET DETAILED RESULT FOR A SPECIFIC EXAM
// ==========================================
export const getMyDetailedResult = async (req, res) => {
  try {
    const user_id = req.user?.uid;
    const { exam_id } = req.params;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!exam_id) {
      return res.status(400).json({ success: false, message: "exam_id required" });
    }

    // Optional role check
    if (req.user?.role !== 'Student') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const student = await Student.findOne({ where: { user_id } });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }
    const student_id = student.student_id;

    // Fetch semester result with exam details
    const semesterResult = await SemesterResult.findOne({
      where: { student_id, exam_id },
      include: [
        {
          model: Exam,
          attributes: ["exam_id", "name", "exam_type", "semester", "academic_year"]
        }
      ]
    });

    if (!semesterResult) {
      return res.status(404).json({ success: false, message: "Result not found for this exam" });
    }

    // Fetch subject results
    const subjectResults = await SubjectResult.findAll({
      where: { student_id, exam_id },
      include: [
        {
          model: Subject,
          attributes: ["subject_id", "subject_name", "credit"]
        }
      ]
    });

    // Fetch component-level marks for this exam (optional – for detailed breakdown)
    const marks = await StudentMarks.findAll({
      where: { student_id, exam_id },
      include: [
        {
          model: SubjectComponent,
          attributes: ["component_id", "type", "max_marks", "min_marks"]
        }
      ]
    });

    // Group marks by subject_id
    const marksBySubject = {};
    marks.forEach(m => {
      if (!marksBySubject[m.subject_id]) marksBySubject[m.subject_id] = [];
      marksBySubject[m.subject_id].push(m);
    });

    // Build detailed subject-wise data
    const subjects = subjectResults.map(sr => {
      const subjectMarks = marksBySubject[sr.subject_id] || [];
      const components = subjectMarks.map(m => ({
        type: m.SubjectComponent?.type,
        marks_obtained: m.marks_obtained,
        max_marks: m.SubjectComponent?.max_marks,
        min_marks: m.SubjectComponent?.min_marks,
        is_pass: m.marks_obtained >= (m.SubjectComponent?.min_marks || 0)
      }));

      return {
        subject_id: sr.subject_id,
        subject_name: sr.Subject?.subject_name,
        credits: sr.Subject?.credit,
        total_marks: sr.total_marks,
        percentage: sr.percentage,
        grade: sr.grade,
        grade_point: sr.grade_point,
        is_pass: sr.is_pass,
        is_backlog: sr.is_backlog,
        components // optional
      };
    });

    const result = {
      exam: {
        exam_id: semesterResult.Exam.exam_id,
        name: semesterResult.Exam.name,
        exam_type: semesterResult.Exam.exam_type,
        semester: semesterResult.Exam.semester,
        academic_year: semesterResult.Exam.academic_year
      },
      summary: {
        sgpa: semesterResult.sgpa,
        cgpa: semesterResult.cgpa,
        result_status: semesterResult.result_status,
        total_credits: semesterResult.total_credits,
        earned_credits: semesterResult.earned_credits
      },
      subjects
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching detailed result:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};