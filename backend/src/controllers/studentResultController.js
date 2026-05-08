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

    // Fetch student
    const student = await Student.findOne({
      where: { user_id },
      attributes: ["student_id", "name", "course_id"]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const student_id = student.student_id;

    const { academic_year, semester, exam_id } = req.query;

    const whereClause = { student_id };

    // ❌ DO NOT filter by academic_year for cumulative

    let targetSemester = null;

    if (exam_id) {
      const targetExam = await SemesterResult.findOne({
        where: { exam_id: Number(exam_id), student_id }
      });

      if (!targetExam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found"
        });
      }

      targetSemester = targetExam.semester;
    }
    else if (semester) {
      targetSemester = Number(semester);
    }

    // ✅ ONLY semester filter
    if (targetSemester) {
      whereClause.semester = {
        [Op.lte]: targetSemester
      };
    }
    // ==========================================
    // HANDLE exam_id (MOST IMPORTANT FIX)
    // ==========================================
    if (exam_id) {
      const targetExam = await SemesterResult.findOne({
        where: { exam_id: Number(exam_id), student_id }
      });

      if (!targetExam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found"
        });
      }

      targetSemester = targetExam.semester;

      // Fetch ALL previous semesters
      whereClause.semester = {
        [Op.lte]: targetSemester
      };
    }

    // ==========================================
    // HANDLE semester (if exam_id not present)
    // ==========================================
    else if (semester) {
      targetSemester = Number(semester);

      whereClause.semester = {
        [Op.lte]: targetSemester
      };
    }

    // ==========================================
    // FETCH SEMESTER RESULTS
    // ==========================================
    const semesterResults = await SemesterResult.findAll({
      where: whereClause,
      include: [
        {
          model: Exam,
          attributes: ["exam_id", "name", "exam_type", "semester", "academic_year"]
        }
      ],
      order: [
        ["semester", "ASC"],
        ["exam_id", "ASC"]
      ]
    });

    if (!semesterResults.length) {
      return res.json({
        success: true,
        student: {
          student_id: student.student_id,
          student_name: student.name,
          course_id: student.course_id
        },
        data: []
      });
    }

    const examIds = semesterResults.map(sr => sr.exam_id);

    // ==========================================
    // SUBJECT RESULTS
    // ==========================================
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

    // ==========================================
    // MARKS
    // ==========================================
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

    // Group marks
    const marksByExamSubject = {};
    marks.forEach(m => {
      const key = `${m.exam_id}_${m.subject_id}`;
      if (!marksByExamSubject[key]) marksByExamSubject[key] = [];
      marksByExamSubject[key].push(m);
    });

    // Group subject results
    const subjectResultsMap = {};
    subjectResults.forEach(sr => {
      if (!subjectResultsMap[sr.exam_id]) subjectResultsMap[sr.exam_id] = [];

      const key = `${sr.exam_id}_${sr.subject_id}`;
      const compMarks = marksByExamSubject[key] || [];

      const components = compMarks.map(m => ({
        type: m.SubjectComponent?.type,
        marks_obtained: m.marks_obtained,
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
        components
      });
    });

    // ==========================================
    // CUMULATIVE CALCULATION
    // ==========================================
    let runningTotalCredits = 0;
    let runningEarnedCredits = 0;
    let runningGradePoints = 0;

    const semesterResultsWithCumulative = [];

    for (const sr of semesterResults) {
      const sgpa = sr.sgpa;
      const totalCredits = sr.total_credits;
      const earnedCredits = sr.earned_credits;

      runningTotalCredits += totalCredits;
      runningEarnedCredits += earnedCredits;
      runningGradePoints += sgpa * totalCredits;

      const cumulativeCGPA = runningTotalCredits
        ? (runningGradePoints / runningTotalCredits).toFixed(2)
        : 0;

      semesterResultsWithCumulative.push({
        exam_id: sr.Exam.exam_id,
        exam_name: sr.Exam.name,
        exam_type: sr.Exam.exam_type,
        semester: sr.Exam.semester,
        academic_year: sr.Exam.academic_year || sr.academic_year,

        // Current semester
        total_credits: totalCredits,
        earned_credits: earnedCredits,
        sgpa: sgpa,

        // Cumulative
        cumulative_total_credits: runningTotalCredits,
        cumulative_earned_credits: runningEarnedCredits,
        cumulative_grade_points: parseFloat(runningGradePoints.toFixed(2)),
        cgpa: parseFloat(cumulativeCGPA),

        result_status: sr.result_status,
        subjects: subjectResultsMap[sr.exam_id] || []
      });
    }

    // ==========================================
    // FINAL FILTER (ONLY SHOW REQUESTED)
    // ==========================================
    let filteredResults = semesterResultsWithCumulative;

    if (exam_id) {
      filteredResults = semesterResultsWithCumulative.filter(
        r => r.exam_id === Number(exam_id)
      );
    } else if (semester) {
      filteredResults = semesterResultsWithCumulative.filter(
        r => r.semester === Number(semester)
      );
    }

    // Group by semester
    const grouped = {};
    filteredResults.forEach(item => {
      const sem = item.semester;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(item);
    });

    const result = Object.keys(grouped).map(sem => ({
      semester: parseInt(sem),
      exams: grouped[sem]
    }));

    return res.json({
      success: true,
      student: {
        student_id: student.student_id,
        student_name: student.name,
        course_id: student.course_id
      },
      data: result
    });

  } catch (error) {
    console.error("Error fetching results:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};