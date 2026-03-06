import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Student } from "../model/Student.js";
import { SemesterResult } from "../model/SemesterResult.js";
import { SubjectResult } from "../model/SubjectResult.js";
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

    if (req.user?.role !== 'Student') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const student = await Student.findOne({ where: { user_id } });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }
    const student_id = student.student_id;

    // Get query parameters for filtering
    const { academic_year, semester } = req.query;

    // Build where clause for SemesterResult
    const whereClause = { student_id };
    if (academic_year) whereClause.academic_year = academic_year;
    if (semester) whereClause.semester = semester;

    // Fetch semester results with optional filters
    const semesterResults = await SemesterResult.findAll({
      where: whereClause,
      include: [
        {
          model: Exam,
          attributes: ["exam_id", "name", "exam_type", "semester"]
        }
      ],
      order: [
        ["semester", "DESC"],
        ["exam_id", "ASC"]
      ]
    });

    if (!semesterResults.length) {
      return res.json({ success: true, data: [] });
    }

    // Fetch all subject results for these exams (always included)
    const examIds = semesterResults.map(sr => sr.exam_id);
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

    // Group subject results by exam_id
    const subjectResultsMap = subjectResults.reduce((acc, sr) => {
      if (!acc[sr.exam_id]) acc[sr.exam_id] = [];
      acc[sr.exam_id].push({
        subject_id: sr.subject_id,
        subject_name: sr.Subject?.subject_name,
        credits: sr.Subject?.credit,
        total_marks: sr.total_marks,
        percentage: sr.percentage,
        grade: sr.grade,
        grade_point: sr.grade_point,
        is_pass: sr.is_pass
      });
      return acc;
    }, {});

    // Group by semester for easier frontend display
    const grouped = {};
    semesterResults.forEach(sr => {
      const sem = sr.semester;
      if (!grouped[sem]) grouped[sem] = [];

      grouped[sem].push({
        exam_id: sr.Exam.exam_id,
        exam_name: sr.Exam.name,
        exam_type: sr.Exam.exam_type,
        academic_year: sr.academic_year,
        sgpa: sr.sgpa,
        cgpa: sr.cgpa,
        result_status: sr.result_status,
        total_credits: sr.total_credits,
        earned_credits: sr.earned_credits,
        subjects: subjectResultsMap[sr.exam_id] || [] // always present
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