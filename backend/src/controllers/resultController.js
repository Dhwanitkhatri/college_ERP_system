import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Student } from "../model/Student.js";
import { Subject } from "../model/Subject.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { StudentMarks } from "../model/StudentMarks.js";
import { SubjectResult } from "../model/SubjectResult.js";
import { SemesterResult } from "../model/SemesterResult.js";
import { Exam } from "../model/Exam.js";
import { Backlog } from "../model/Backlog.js";
import { BacklogAttempt } from "../model/BacklogAttempts.js";
import { Class } from "../model/Class.js";

// ======================
// GRADE FUNCTION
// ======================
const getGrade = (percentage) => {
  if (percentage >= 90) return { grade: "A+", gp: 10 };
  if (percentage >= 80) return { grade: "A", gp: 9 };
  if (percentage >= 70) return { grade: "B+", gp: 8 };
  if (percentage >= 60) return { grade: "B", gp: 7 };
  if (percentage >= 50) return { grade: "C", gp: 6 };
  if (percentage >= 40) return { grade: "D", gp: 5 };
  return { grade: "F", gp: 0 };
};

// ======================
// MAIN CONTROLLER
// ======================
export const generateStudentResult = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { student_id } = req.body;
    if (!student_id) throw new Error("student_id required");

    // ======================
    // GET STUDENT + CLASS
    // ======================
    const student = await Student.findOne({
      where: { student_id },
      include: [{ model: Class, attributes: ["semester"] }]
    });

    if (!student) throw new Error("Student not found");

    const semester = student.Class?.semester;
    if (!semester) throw new Error("Semester not found");

    // ======================
    // GET PUBLISHED EXAMS
    // ======================
    const exams = await Exam.findAll({
      where: { semester, status: "PUBLISHED" }
    });

    if (!exams.length) throw new Error("No exams published");

    const finalExam =
      exams.find(e => e.exam_type === "EXTERNAL") || exams[0];

    const finalExamId = finalExam.exam_id;

    // ======================
    // DUPLICATE CHECK
    // ======================
    const exists = await SemesterResult.findOne({
      where: { student_id, exam_id: finalExamId }
    });

    if (exists) throw new Error("Result already generated");

    // ======================
    // GET SUBJECTS WHERE STUDENT HAS MARKS
    // ======================
    const studentMarksSubjects = await StudentMarks.findAll({
      where: { student_id },
      attributes: ["subject_id"],
      group: ["subject_id"]
    });

    if (!studentMarksSubjects.length)
      throw new Error("No marks found for this student");

    const subjectIds = studentMarksSubjects.map(s => s.subject_id);

    const subjects = await Subject.findAll({
      where: {
        subject_id: { [Op.in]: subjectIds },
        semester,
        course_id: student.course_id
      }
    });

    if (!subjects.length)
      throw new Error("No valid subjects found");

    let totalCredits = 0;
    let earnedCredits = 0;
    let totalGradePoints = 0;

    const subjectResults = [];

    // ======================
    // SUBJECT LOOP
    // ======================
    for (const subject of subjects) {
      const components = await SubjectComponent.findAll({
        where: { subject_id: subject.subject_id }
      });

      if (!components.length) continue;

      let totalMarks = 0;
      let maxTotal = 0;
      let isPass = true;

      let breakdown = {
        INTERNAL: 0,
        EXTERNAL: 0,
        ASSIGNMENT: 0,
        ATTENDANCE: 0
      };

      for (const comp of components) {
        const marks = await StudentMarks.findAll({
          where: {
            student_id,
            subject_id: subject.subject_id,
            component_id: comp.component_id
          }
        });

        const obtained = marks.reduce(
          (sum, m) => sum + (Number(m.marks_obtained) || 0),
          0
        );

        totalMarks += obtained;
        maxTotal += comp.max_marks;

        // 🔥 CORRECTED BREAKDOWN LOGIC – uses component_name directly
        if (comp.type === "EXAM") {
          if (comp.component_name === "INTERNAL") {
            breakdown.INTERNAL += obtained;
          } else if (comp.component_name === "EXTERNAL") {
            breakdown.EXTERNAL += obtained;
          }
          // If there are other exam-type components, handle them similarly
        } else {
          // For non-exam components (ASSIGNMENT, ATTENDANCE, etc.)
          breakdown[comp.type] += obtained;
        }

        if (obtained < comp.min_marks) isPass = false;
      }

      let percentage = 0;
      if (maxTotal > 0) {
        percentage = parseFloat(
          ((totalMarks / maxTotal) * 100).toFixed(2)
        );
      }

      const { grade, gp } = getGrade(percentage);
      const credits = subject.credits || 1;

      totalCredits += credits;

      if (isPass) {
        earnedCredits += credits;
        totalGradePoints += credits * gp;
      }

      // SAVE SUBJECT RESULT
      await SubjectResult.create({
        student_id,
        subject_id: subject.subject_id,
        exam_id: finalExamId,
        total_marks: totalMarks,
        percentage,
        grade,
        grade_point: gp,
        is_pass: isPass,
        is_backlog: !isPass
      }, { transaction: t });

      // ======================
      // BACKLOG LOGIC
      // ======================
      const backlog = await Backlog.findOne({
        where: { student_id, subject_id: subject.subject_id }
      });

      if (!isPass) {
        if (!backlog) {
          const newBacklog = await Backlog.create({
            student_id,
            subject_id: subject.subject_id,
            first_failed_exam_id: finalExamId,
            total_attempts: 1,
            status: "ACTIVE"
          }, { transaction: t });

          await BacklogAttempt.create({
            backlog_id: newBacklog.backlog_id,
            exam_id: finalExamId,
            attempt_number: 1,
            result_status: "FAIL"
          }, { transaction: t });
        } else {
          const next = backlog.total_attempts + 1;

          await backlog.update(
            { total_attempts: next },
            { transaction: t }
          );

          await BacklogAttempt.create({
            backlog_id: backlog.backlog_id,
            exam_id: finalExamId,
            attempt_number: next,
            result_status: "FAIL"
          }, { transaction: t });
        }
      } else {
        if (backlog && backlog.status === "ACTIVE") {
          const next = backlog.total_attempts + 1;

          await backlog.update({
            cleared_exam_id: finalExamId,
            total_attempts: next,
            status: "CLEARED"
          }, { transaction: t });

          await BacklogAttempt.create({
            backlog_id: backlog.backlog_id,
            exam_id: finalExamId,
            attempt_number: next,
            result_status: "PASS"
          }, { transaction: t });
        }
      }

      subjectResults.push({
        subject_id: subject.subject_id,
        internal: breakdown.INTERNAL,
        external: breakdown.EXTERNAL,
        assignment: breakdown.ASSIGNMENT,
        attendance: breakdown.ATTENDANCE,
        total_marks: totalMarks,
        percentage,
        grade,
        is_pass: isPass
      });
    }

    // ======================
    // SGPA
    // ======================
    const sgpa = totalCredits
      ? parseFloat((totalGradePoints / totalCredits).toFixed(2))
      : 0;

    const resultStatus =
      earnedCredits === totalCredits ? "PASS" : "FAIL";

    // ======================
    // CGPA
    // ======================
    const previousResults = await SemesterResult.findAll({
      where: { student_id }
    });

    let totalAllCredits = totalCredits;
    let totalAllGradePoints = totalGradePoints;

    previousResults.forEach(r => {
      totalAllCredits += r.total_credits;
      totalAllGradePoints += r.sgpa * r.total_credits;
    });

    const cgpa = totalAllCredits
      ? parseFloat(
          (totalAllGradePoints / totalAllCredits).toFixed(2)
        )
      : sgpa;

    // SAVE SEMESTER RESULT
    await SemesterResult.create({
      student_id,
      exam_id: finalExamId,
      total_credits: totalCredits,
      earned_credits: earnedCredits,
      sgpa,
      cgpa,
      result_status: resultStatus
    }, { transaction: t });

    await t.commit();

    return res.json({
      success: true,
      sgpa,
      cgpa,
      resultStatus,
      subjects: subjectResults
    });

  } catch (err) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};