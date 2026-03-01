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
// CORE RESULT GENERATION FOR ONE STUDENT
// ======================
const generateResultForStudent = async (student_id, exam_id, transaction, options = { skipExisting: false }) => {
  // Get student with class
  const student = await Student.findOne({
    where: { student_id },
    include: [{ model: Class, attributes: ["semester"] }],
    transaction
  });
  if (!student) throw new Error("Student not found");

  const semester = student.Class?.semester;
  if (!semester) throw new Error("Student has no class or semester");

  // Get exam
  const exam = await Exam.findByPk(exam_id, { transaction });
  if (!exam) throw new Error("Exam not found");
  if (exam.status !== "PUBLISHED") throw new Error("Exam is not published");

  // Check if result already exists for this student and exam
  const existingSemesterResult = await SemesterResult.findOne({
    where: { student_id, exam_id },
    transaction
  });
  if (existingSemesterResult) {
    if (options.skipExisting) {
      return null; // skip silently
    } else {
      throw new Error("Result already generated for this student and exam");
    }
  }

  // Get subjects for this semester and student's course
  const subjects = await Subject.findAll({
    where: {
      semester,
      course_id: student.course_id
    },
    transaction
  });

  if (!subjects.length) throw new Error("No subjects found for this semester/course");

  // Pre-fetch all marks for this student to avoid N+1 queries
  const allMarks = await StudentMarks.findAll({
    where: { student_id },
    transaction
  });

  let totalCredits = 0;
  let earnedCredits = 0;
  let totalGradePoints = 0;
  const subjectResults = [];

  for (const subject of subjects) {
    const components = await SubjectComponent.findAll({
      where: { subject_id: subject.subject_id },
      transaction
    });

    if (!components.length) continue;

    let totalMarks = 0;
    let maxTotal = 0;
    let isPass = true;

    // Initialize breakdown with all possible component types
    const breakdown = {
      INTERNAL: 0,
      EXTERNAL: 0,
      ASSIGNMENT: 0,
      ATTENDANCE: 0,
    };

    for (const comp of components) {
      const marks = allMarks.filter(
        m => m.subject_id === subject.subject_id && m.component_id === comp.component_id
      );

      const obtained = marks.reduce((sum, m) => sum + (Number(m.marks_obtained) || 0), 0);

      totalMarks += obtained;
      maxTotal += comp.max_marks;

      // Add obtained marks to the corresponding type
      breakdown[comp.type] = (breakdown[comp.type] || 0) + obtained;

      if (obtained < comp.min_marks) isPass = false;
    }

    const percentage = maxTotal ? parseFloat(((totalMarks / maxTotal) * 100).toFixed(2)) : 0;
    const { grade, gp } = getGrade(percentage);
    const credits = subject.credits || 1;

    totalCredits += credits;
    if (isPass) {
      earnedCredits += credits;
      totalGradePoints += credits * gp;
    }

    // Save subject result
    await SubjectResult.create({
      student_id,
      subject_id: subject.subject_id,
      exam_id,
      total_marks: totalMarks,
      percentage,
      grade,
      grade_point: gp,
      is_pass: isPass,
      is_backlog: !isPass
    }, { transaction });

    // Backlog logic
    const backlog = await Backlog.findOne({
      where: { student_id, subject_id: subject.subject_id },
      transaction
    });

    if (!isPass) {
      if (!backlog) {
        const newBacklog = await Backlog.create({
          student_id,
          subject_id: subject.subject_id,
          first_failed_exam_id: exam_id,
          total_attempts: 1,
          status: "ACTIVE"
        }, { transaction });
        await BacklogAttempt.create({
          backlog_id: newBacklog.backlog_id,
          exam_id,
          attempt_number: 1,
          result_status: "FAIL"
        }, { transaction });
      } else {
        const next = backlog.total_attempts + 1;
        await backlog.update({ total_attempts: next }, { transaction });
        await BacklogAttempt.create({
          backlog_id: backlog.backlog_id,
          exam_id,
          attempt_number: next,
          result_status: "FAIL"
        }, { transaction });
      }
    } else {
      if (backlog && backlog.status === "ACTIVE") {
        const next = backlog.total_attempts + 1;
        await backlog.update({
          cleared_exam_id: exam_id,
          total_attempts: next,
          status: "CLEARED"
        }, { transaction });
        await BacklogAttempt.create({
          backlog_id: backlog.backlog_id,
          exam_id,
          attempt_number: next,
          result_status: "PASS"
        }, { transaction });
      }
    }

    subjectResults.push({
      subject_id: subject.subject_id,
      ...breakdown, // includes all types (INTERNAL, EXTERNAL, etc.)
      total_marks: totalMarks,
      percentage,
      grade,
      is_pass: isPass
    });
  }

  // SGPA
  const sgpa = totalCredits ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;
  const resultStatus = earnedCredits === totalCredits ? "PASS" : "FAIL";

  // CGPA – fetch previous semester results
  const previousResults = await SemesterResult.findAll({
    where: { student_id },
    transaction
  });
  let totalAllCredits = totalCredits;
  let totalAllGradePoints = totalGradePoints;
  previousResults.forEach(r => {
    totalAllCredits += r.total_credits;
    totalAllGradePoints += r.sgpa * r.total_credits;
  });
  const cgpa = totalAllCredits ? parseFloat((totalAllGradePoints / totalAllCredits).toFixed(2)) : sgpa;

  // Save semester result
  await SemesterResult.create({
    student_id,
    exam_id,
    total_credits: totalCredits,
    earned_credits: earnedCredits,
    sgpa,
    cgpa,
    result_status: resultStatus
  }, { transaction });

  return {
    student_id,
    sgpa,
    cgpa,
    resultStatus,
    subjects: subjectResults
  };
};

// ======================
// SINGLE STUDENT RESULT GENERATION
// ======================
export const generateStudentResult = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { student_id, exam_id } = req.body;
    if (!student_id || !exam_id) {
      throw new Error("student_id and exam_id are required");
    }

    const result = await generateResultForStudent(student_id, exam_id, t, { skipExisting: false });

    await t.commit();
    return res.json({ success: true, data: result });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// BULK RESULT GENERATION FOR ALL STUDENTS IN A SEMESTER/COURSE
// ======================
export const generateBulkResults = async (req, res) => {
  try {
    const { exam_id, semester } = req.body;
    const course_id = req.user?.course_id; // from auth middleware

    if (!exam_id) throw new Error("exam_id is required");
    if (!semester) throw new Error("semester is required");
    if (!course_id) throw new Error("User course_id not found. Cannot generate results.");

    // Validate exam
    const exam = await Exam.findByPk(exam_id);
    if (!exam) throw new Error("Exam not found");
    if (exam.status !== "PUBLISHED") throw new Error("Exam is not published");

    // Build student filter using course_id from user token
    const classWhere = { semester, course_id };
    const students = await Student.findAll({
      include: [{
        model: Class,
        where: classWhere,
        required: true,
        attributes: []
      }],
      attributes: ['student_id']
    });

    if (!students.length) throw new Error("No students found for the given semester and your course");

    const results = [];
    const errors = [];

    for (const student of students) {
      const t = await sequelize.transaction();
      try {
        const result = await generateResultForStudent(student.student_id, exam_id, t, { skipExisting: true });
        await t.commit();
        if (result) results.push(result);
        else results.push({ student_id: student.student_id, status: "skipped (already exists)" });
      } catch (err) {
        await t.rollback();
        errors.push({ student_id: student.student_id, error: err.message });
      }
    }

    return res.json({
      success: true,
      total: students.length,
      generated: results.length,
      errors
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}