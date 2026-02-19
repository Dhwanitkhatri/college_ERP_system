import { sequelize } from "../config/db.js";
import { Student } from "../model/Student.js";
import { Subject } from "../model/Subject.js";
import { StudentMarks } from "../model/StudentMarks.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { SubjectResult } from "../model/SubjectResult.js";
import { SemesterResult } from "../model/SemesterResult.js";
import { Exam } from "../model/Exam.js";
import { Op } from "sequelize";

//  Grade Logic
const getGrade = (percentage) => {
  if (percentage >= 90) return { grade: "A+", gp: 10 };
  if (percentage >= 80) return { grade: "A", gp: 9 };
  if (percentage >= 70) return { grade: "B+", gp: 8 };
  if (percentage >= 60) return { grade: "B", gp: 7 };
  if (percentage >= 50) return { grade: "C", gp: 6 };
  if (percentage >= 40) return { grade: "D", gp: 5 };
  return { grade: "F", gp: 0 };
};

export const generateStudentResult = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { exam_id, student_id } = req.body;

    if (!exam_id || !student_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "exam_id and student_id are required"
      });
    }

    //  Check Exam
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (exam.status !== "PUBLISHED") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Publish exam before generating result"
      });
    }

    //  Check Student
    const student = await Student.findOne({ where: { student_id } });
    if (!student) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    //  Prevent duplicate result
    const existing = await SemesterResult.findOne({
      where: { student_id, exam_id }
    });

    if (existing) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Result already generated"
      });
    }

    //  Get Subjects
    const subjects = await Subject.findAll({
      where: { semester: student.current_semester }
    });

    let totalCredits = 0;
    let earnedCredits = 0;
    let totalGradePoints = 0;

    const subjectResultsData = [];

    //  LOOP SUBJECTS
    for (const subject of subjects) {

      const components = await SubjectComponent.findAll({
        where: { subject_id: subject.subject_id }
      });

      if (!components.length) continue;

      let totalMarks = 0;
      let maxTotal = 0;
      let isPass = true;

      for (const comp of components) {

        let whereCondition = {
          student_id,
          subject_id: subject.subject_id,
          component_id: comp.component_id
        };

        //  IMPORTANT LOGIC
        if (comp.type === "EXAM") {
          whereCondition.exam_id = exam_id;
        } else {
          whereCondition.exam_id = null;
        }

        const mark = await StudentMarks.findOne({ where: whereCondition });

        const obtained = mark ? mark.marks_obtained : 0;

        totalMarks += obtained;
        maxTotal += comp.max_marks;

        //  FAIL CONDITION
        if (obtained < comp.min_marks) {
          isPass = false;
        }
      }

      if (maxTotal === 0) continue;

      const percentage = (totalMarks / maxTotal) * 100;
      const { grade, gp } = getGrade(percentage);

      const credits = subject.credits || 0;

      totalCredits += credits;

      if (isPass) {
        earnedCredits += credits;
        totalGradePoints += credits * gp;
      }

      //  Save Subject Result
      await SubjectResult.create({
        student_id,
        subject_id: subject.subject_id,
        exam_id,
        total_marks: totalMarks,
        percentage: parseFloat(percentage.toFixed(2)),
        grade,
        grade_point: gp,
        is_pass: isPass,
        is_backlog: !isPass
      }, { transaction: t });

      subjectResultsData.push({
        subject_id: subject.subject_id,
        subject_name: subject.subject_name,
        credits,
        total_marks: totalMarks,
        max_marks: maxTotal,
        percentage: percentage.toFixed(2),
        grade,
        is_pass: isPass
      });
    }

    //  SGPA
    const sgpa = totalCredits
      ? parseFloat((totalGradePoints / totalCredits).toFixed(2))
      : 0;

    //  RESULT STATUS
    let resultStatus = "FAIL";
    if (earnedCredits === totalCredits) resultStatus = "PASS";
    else if (earnedCredits > 0) resultStatus = "SUPPLEMENTARY";

    //  CGPA
    const prevResults = await SemesterResult.findAll({
      where: {
        student_id,
        exam_id: { [Op.ne]: exam_id }
      }
    });

    let cgpa = sgpa;

    if (prevResults.length > 0) {
      const total = prevResults.reduce((sum, r) => sum + r.sgpa, 0) + sgpa;
      cgpa = parseFloat((total / (prevResults.length + 1)).toFixed(2));
    }

    //  Save Semester Result
    await SemesterResult.create({
      student_id,
      exam_id,
      total_credits: totalCredits,
      earned_credits: earnedCredits,
      sgpa,
      cgpa,
      result_status: resultStatus
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Result Generated Successfully 🚀",
      data: {
        student_id,
        student_name: student.name,
        semester: student.current_semester,
        exam_id,
        sgpa,
        cgpa,
        result_status: resultStatus,
        total_credits: totalCredits,
        earned_credits: earnedCredits,
        subjects: subjectResultsData
      }
    });

  } catch (error) {
    await t.rollback();

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
