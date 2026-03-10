import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Student } from "../model/Student.js";
import { SemesterResult } from "../model/SemesterResult.js";
import { Exam } from "../model/Exam.js";

// ==========================================
// GENERATE RANKINGS (Top 10 by SGPA)
// ==========================================
export const generateRankings = async (req, res) => {
  try {
    const { exam_id, academic_year, semester, limit = 10 } = req.query;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    if (!exam_id) {
      return res.status(400).json({ success: false, message: "exam_id is required" });
    }

    // Verify exam belongs to the user's course
    const exam = await Exam.findOne({ where: { exam_id, course_id } });
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found or not in your course" });
    }

    // Build where clause for SemesterResult
    const where = { exam_id };
    if (academic_year) where.academic_year = academic_year;
    if (semester) where.semester = semester;

    // Fetch all semester results for this exam, ordered by SGPA descending
    const results = await SemesterResult.findAll({
      where,
      include: [
        {
          model: Student,
          where: { course_id }, // ensure student belongs to same course
          attributes: ["student_id", "student_name"]
        }
      ],
      order: [["sgpa", "DESC"]]
    });

    if (!results.length) {
      return res.status(404).json({ success: false, message: "No results found for the given criteria" });
    }

    // Calculate ranks with ties
    let rank = 1;
    let prevSgpa = null;
    let skipCount = 0;

    const rankings = results.map((result, index) => {
      const sgpa = result.sgpa;
      if (prevSgpa !== null && sgpa < prevSgpa) {
        rank += skipCount;
        skipCount = 0;
      }
      if (prevSgpa !== null && sgpa === prevSgpa) {
        skipCount++;
      } else {
        if (prevSgpa !== null) skipCount = 0;
        prevSgpa = sgpa;
      }
      return {
        rank,
        student_id: result.Student.student_id,
        student_name: result.Student.student_name,
        sgpa: sgpa,
        total_credits: result.total_credits,
        earned_credits: result.earned_credits,
        result_status: result.result_status
      };
    });

    // Limit to top N (default 10)
    const topRankings = rankings.slice(0, parseInt(limit));

    res.json({
      success: true,
      exam: {
        exam_id: exam.exam_id,
        name: exam.name,
        exam_type: exam.exam_type,
        semester: exam.semester,
        academic_year: exam.academic_year
      },
      total_students: results.length,
      rankings: topRankings
    });
  } catch (error) {
    console.error("Error generating rankings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};