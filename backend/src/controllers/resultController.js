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
const generateResultForStudent = async (
  student_id,
  exam_id,
  transaction,
  options = { skipExisting: false }
) => {
  // ---------- Student + Class ----------
  const student = await Student.findOne({
    where: { student_id },
    include: [{ model: Class, attributes: ["semester"] }],
    transaction
  });
  if (!student) throw new Error("Student not found");
  const semester = student.Class?.semester;
  if (!semester) throw new Error("Student semester not found");

  // ---------- Exam ----------
  const exam = await Exam.findByPk(exam_id, { transaction });
  if (!exam) throw new Error("Exam not found");
  if (exam.status !== "PUBLISHED") throw new Error("Exam is not published");

  // ---------- Prevent duplicate ----------
  const existing = await SemesterResult.findOne({
    where: { student_id, exam_id },
    transaction
  });
  if (existing) {
    if (options.skipExisting) return null;
    throw new Error("Result already generated");
  }

  // ---------- Subjects for this semester & course ----------
  const subjects = await Subject.findAll({
    where: {
      semester,
      course_id: student.course_id
    },
    transaction
  });
  if (!subjects.length) throw new Error("No subjects found");
  const subjectIds = subjects.map(s => s.subject_id);

  // ---------- Fetch all components (optimised) ----------
  const components = await SubjectComponent.findAll({
    where: { subject_id: subjectIds },
    transaction
  });
  const componentMap = {};
  components.forEach(c => {
    if (!componentMap[c.subject_id]) componentMap[c.subject_id] = [];
    componentMap[c.subject_id].push(c);
  });

  // ========== FIX: Identify internal exams ==========
  // Treat all other PUBLISHED 'REGULAR' exams in the same semester & course as internal.
  const otherRegularExams = await Exam.findAll({
    where: {
      semester,
      course_id: student.course_id,
      exam_type: "REGULAR",
      exam_id: { [Op.ne]: exam_id },
      status: "PUBLISHED"
    },
    attributes: ["exam_id"],
    transaction
  });
  const internalExamIds = otherRegularExams.map(e => e.exam_id);

  // ---------- Fetch all relevant marks ----------
  const allMarks = await StudentMarks.findAll({
    where: {
      student_id,
      subject_id: { [Op.in]: subjectIds },
      [Op.or]: [
        { exam_id },                       // marks from the current exam
        { exam_id: { [Op.in]: internalExamIds } }, // marks from internal exams
        { exam_id: null }                   // continuous components (assignments, attendance)
      ]
    },
    transaction
  });

  // ---------- Build marks map for O(1) access ----------
  const marksMap = {};
  allMarks.forEach(m => {
    const key = `${m.subject_id}_${m.component_id}`;
    if (!marksMap[key]) marksMap[key] = [];
    marksMap[key].push(m);
  });

  let totalCredits = 0;
  let earnedCredits = 0;
  let totalGradePoints = 0;
  const subjectResults = [];

  // ---------- Subject loop ----------
  for (const subject of subjects) {
    const comps = componentMap[subject.subject_id] || [];
    if (!comps.length) continue;

    let totalMarks = 0;
    let maxTotal = 0;
    let isPass = true;

    const breakdown = {
      INTERNAL: 0,
      EXTERNAL: 0,
      ASSIGNMENT: 0,
      ATTENDANCE: 0
    };

    for (const comp of comps) {
      const key = `${subject.subject_id}_${comp.component_id}`;
      const marks = marksMap[key] || [];
      const obtained = marks.reduce(
        (sum, m) => sum + Number(m.marks_obtained || 0),
        0
      );

      totalMarks += obtained;
      maxTotal += comp.max_marks;
      breakdown[comp.type] = (breakdown[comp.type] || 0) + obtained;

      if (obtained < comp.min_marks) isPass = false;
    }

    if (maxTotal === 0) continue;

    const percentage = parseFloat(((totalMarks / maxTotal) * 100).toFixed(2));
    const { grade, gp } = getGrade(percentage);
    const credits = subject.credit || 1;

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

    // ---------- Backlog Logic ----------
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
      total_marks: totalMarks,
      percentage,
      grade,
      is_pass: isPass
    });
  }

  // ---------- SGPA ----------
  const sgpa = totalCredits
    ? parseFloat((totalGradePoints / totalCredits).toFixed(2))
    : 0;
  const resultStatus = earnedCredits === totalCredits ? "PASS" : "FAIL";

  // ---------- CGPA (excluding current exam) ----------
  const previousResults = await SemesterResult.findAll({
    where: { student_id, exam_id: { [Op.ne]: exam_id } },
    transaction
  });
  let totalAllCredits = totalCredits;
  let totalAllGradePoints = totalGradePoints;
  previousResults.forEach(r => {
    totalAllCredits += r.total_credits;
    totalAllGradePoints += r.sgpa * r.total_credits;
  });
  const cgpa = totalAllCredits
    ? parseFloat((totalAllGradePoints / totalAllCredits).toFixed(2))
    : sgpa;

  // ---------- Save semester result (with semester) ----------
  await SemesterResult.create({
    student_id,
    exam_id,
    semester,
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
// SINGLE STUDENT RESULT API
// ======================
export const generateStudentResult = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { student_id, exam_id } = req.body;
    if (!student_id || !exam_id) {
      throw new Error("student_id and exam_id are required");
    }

    const result = await generateResultForStudent(student_id, exam_id, t);
    await t.commit();
    res.json({ success: true, data: result });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================
// BULK RESULT GENERATION API
// ======================
export const generateBulkResults = async (req, res) => {
  try {
    const { exam_id, semester } = req.body;
    const course_id = req.user?.course_id;

    if (!exam_id || !semester) {
      throw new Error("exam_id and semester are required");
    }
    if (!course_id) {
      throw new Error("Access denied: No course associated");
    }

    // Validate exam belongs to the user's course
    const exam = await Exam.findOne({ where: { exam_id, course_id } });
    if (!exam) throw new Error("Exam not found or not in your course");
    if (exam.status !== "PUBLISHED") throw new Error("Exam is not published");

    // Get all students in the given semester and course
    const students = await Student.findAll({
      include: [{
        model: Class,
        where: { semester, course_id },
        required: true,
        attributes: []
      }],
      attributes: ["student_id"]
    });

    if (!students.length) throw new Error("No students found");

    const generated = [];
    const skipped = [];
    const failed = [];

    for (const student of students) {
      const t = await sequelize.transaction();
      try {
        const result = await generateResultForStudent(
          student.student_id,
          exam_id,
          t,
          { skipExisting: true }
        );
        await t.commit();
        if (result) generated.push(student.student_id);
        else skipped.push(student.student_id);
      } catch (err) {
        await t.rollback();
        failed.push({ student_id: student.student_id, error: err.message });
      }
    }

    res.json({
      success: true,
      summary: {
        total: students.length,
        generated: generated.length,
        skipped: skipped.length,
        failed: failed.length
      },
      failed_students: failed
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};