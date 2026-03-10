import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Student } from "../model/Student.js";
import { SemesterResult } from "../model/SemesterResult.js";
import { SubjectResult } from "../model/SubjectResult.js";
import { StudentMarks } from "../model/StudentMarks.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { Exam } from "../model/Exam.js";
import { Subject } from "../model/Subject.js";

// ==========================================
// GET ALL SEMESTER RESULTS FOR LOGGED-IN STUDENT
// ==========================================
export const getMyResults = async (req, res) => {
  try {
    const user_id = req.user?.uid;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user?.role !== "Student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // fetch student with some basic details
    const student = await Student.findOne({
      where: { user_id },
      attributes: ["student_id", "student_name", "enrollment_no", "course_id"]
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student profile not found" });
    }
    const student_id = student.student_id;

    // Get query parameters for filtering
    const { academic_year, semester, exam_id } = req.query;

    // Build where clause for SemesterResult
    const whereClause = { student_id };
    if (academic_year) whereClause.academic_year = academic_year;
    if (semester) whereClause.semester = Number(semester);
    if (exam_id) whereClause.exam_id = Number(exam_id);

    // Fetch semester results with optional filters
    const semesterResults = await SemesterResult.findAll({
      where: whereClause,
      include: [
        {
          model: Exam,
          attributes: ["exam_id", "name", "exam_type", "semester", "academic_year"]
        }
      ],
      order: [
        ["semester", "DESC"],
        ["exam_id", "ASC"]
      ]
    });

    if (!semesterResults.length) {
      return res.json({
        success: true,
        student: {
          student_id: student.student_id,
          student_name: student.student_name,
          course_id: student.course_id
        },
        data: []
      });
    }

    const examIds = semesterResults.map(sr => sr.exam_id);

    // Fetch all subject results for these exams
    const subjectResults = await SubjectResult.findAll({
      where: {
        student_id,
        exam_id: { [Op.in]: examIds }
      },
      include: [
        {
          model: Subject,
          attributes: ["subject_id", "subject_name", "credit"]
        }
      ],
      order: [["subject_id", "ASC"]]
    });

    // Fetch all student marks for these exams, including component details
    const marks = await StudentMarks.findAll({
      where: {
        student_id,
        exam_id: { [Op.in]: examIds }
      },
      include: [
        {
          model: SubjectComponent,
          attributes: ["component_id", "type", "max_marks", "min_marks"]
        }
      ]
    });

    // Group marks by exam_id and subject_id
    const marksByExamSubject = {};
    marks.forEach(m => {
      const key = `${m.exam_id}_${m.subject_id}`;
      if (!marksByExamSubject[key]) marksByExamSubject[key] = [];
      marksByExamSubject[key].push(m);
    });

    // Group subject results by exam_id
    const subjectResultsMap = {};
    subjectResults.forEach(sr => {
      if (!subjectResultsMap[sr.exam_id]) subjectResultsMap[sr.exam_id] = [];
      
      // For this subject, get its component marks
      const key = `${sr.exam_id}_${sr.subject_id}`;
      const compMarks = marksByExamSubject[key] || [];
      
      // Build component breakdown
      const components = compMarks.map(m => ({
        type: m.SubjectComponent?.type,
        marks_obtained: m.marks_obtained,
       // max_marks: m.SubjectComponent?.max_marks,
       // min_marks: m.SubjectComponent?.min_marks,
        is_pass: m.marks_obtained >= (m.SubjectComponent?.min_marks || 0)
      }));

      subjectResultsMap[sr.exam_id].push({
        subject_id: sr.subject_id,
        subject_name: sr.Subject?.subject_name,
        credits: sr.Subject?.credit,
        total_marks: sr.total_marks,
        percentage: sr.percentage,
        grade: sr.grade,
        grade_point: sr.grade_point,
        is_pass: sr.is_pass,
        components  // ✅ component-wise breakdown added
      });
    });

    // Group by semester for easier frontend display
    const grouped = {};
    semesterResults.forEach(sr => {
      const sem = sr.semester;
      if (!grouped[sem]) grouped[sem] = [];

      grouped[sem].push({
        exam_id: sr.Exam.exam_id,
        exam_name: sr.Exam.name,
        exam_type: sr.Exam.exam_type,
        academic_year: sr.Exam.academic_year || sr.academic_year,
        sgpa: sr.sgpa,
        cgpa: sr.cgpa,
        result_status: sr.result_status,
        total_credits: sr.total_credits,
        earned_credits: sr.earned_credits,
        subjects: subjectResultsMap[sr.exam_id] || []
      });
    });

    // Convert to array for response
    const result = Object.keys(grouped).map(sem => ({
      semester: parseInt(sem),
      exams: grouped[sem]
    }));

    return res.json({
      success: true,
      student: {
        student_id: student.student_id,
        student_name: student.student_name,
        // enrollment_no: student.enrollment_no,
        course_id: student.course_id
      },
      data: result
    });
  } catch (error) {
    console.error("Error fetching student results:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};