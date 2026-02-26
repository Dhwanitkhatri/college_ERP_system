import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { Exam } from "../model/Exam.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { Backlog } from "../model/Backlog.js";
import { BacklogAttempt } from "../model/BacklogAttempts.js";
import { StudentMarks } from "../model/StudentMarks.js";
import { Student } from "../model/Student.js";
import { Subject } from "../model/Subject.js";
//import { ExamTimetable } from "../model/ExamTimetable.js";

// ==========================================
// 1. CREATE BACKLOG EXAM (with both components)
// ==========================================
export const createBacklogExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      subject_id,
      semester,
      academic_year,
      internal_max = 25,
      internal_min = 11,
      external_max = 50,
      external_min = 22,
     // exam_date,
     // start_time,
      //end_time
    } = req.body;

    // Validate subject
    const subject = await Subject.findOne({ where: { subject_id, semester } });
    if (!subject) throw new Error("Subject not found for given semester");

    // Create or find BACKLOG_INTERNAL component
    let internalComp = await SubjectComponent.findOne({
      where: { subject_id, component_name: "BACKLOG_INTERNAL", type: "EXAM" }
    });
    if (!internalComp) {
      internalComp = await SubjectComponent.create({
        subject_id,
        component_name: "BACKLOG_INTERNAL",
        type: "EXAM",
        max_marks: internal_max,
        min_marks: internal_min
      }, { transaction: t });
    }

    // Create or find BACKLOG_EXTERNAL component
    let externalComp = await SubjectComponent.findOne({
      where: { subject_id, component_name: "BACKLOG_EXTERNAL", type: "EXAM" }
    });
    if (!externalComp) {
      externalComp = await SubjectComponent.create({
        subject_id,
        component_name: "BACKLOG_EXTERNAL",
        type: "EXAM",
        max_marks: external_max,
        min_marks: external_min
      }, { transaction: t });
    }

    // Create the backlog exam
    const exam = await Exam.create({
      name: `Backlog - ${subject.subject_name}`,
      exam_type: "BACKLOG",
      semester,
      academic_year,
      status: "DRAFT"
    }, { transaction: t });

    // Optionally create ExamTimetable entries if you have that model
   // await ExamTimetable.create({ exam_id: exam.exam_id, subject_id, exam_date, start_time, end_time }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: "Backlog exam created with both internal and external components",
      data: { exam, components: [internalComp, externalComp] }
    });

  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 2. GET ELIGIBLE STUDENTS (unchanged)
// ==========================================
export const getEligibleStudents = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const backlogs = await Backlog.findAll({
      where: { subject_id, status: "ACTIVE" },
      include: [
        { model: Student, attributes: ["student_id", "name", "email"] },
        { model: Subject, attributes: ["subject_name"] }
      ]
    });
    res.json({ success: true, data: backlogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. ENTER MARKS FOR A BACKLOG COMPONENT
// ==========================================
export const enterBacklogMarks = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { student_id, exam_id, subject_id, component_name, marks_obtained } = req.body;

    // Validate exam
    const exam = await Exam.findOne({ where: { exam_id, exam_type: "BACKLOG" } });
    if (!exam) throw new Error("Backlog exam not found");

    // Validate backlog exists and is ACTIVE
    const backlog = await Backlog.findOne({
      where: { student_id, subject_id, status: "ACTIVE" }
    });
    if (!backlog) throw new Error("Student does not have an active backlog for this subject");

    // Find the correct component
    const component = await SubjectComponent.findOne({
      where: { subject_id, component_name, type: "EXAM" }
    });
    if (!component) throw new Error(`Component ${component_name} not found for this subject`);

    // Save/update marks
    const [marks, created] = await StudentMarks.upsert({
      student_id,
      subject_id,
      exam_id,
      component_id: component.component_id,
      marks_obtained
    }, { transaction: t, returning: true });

    await t.commit();

    res.json({
      success: true,
      message: created ? "Marks entered" : "Marks updated",
      data: marks
    });

  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 4. GENERATE BACKLOG RESULTS (both components)
// ==========================================
export const generateBacklogResult = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { exam_id } = req.body;

    const exam = await Exam.findOne({ where: { exam_id, exam_type: "BACKLOG" } });
    if (!exam) throw new Error("Backlog exam not found");
    if (exam.status !== "PUBLISHED") throw new Error("Exam must be published first");

    // Get all marks for this exam, including component info
    const marks = await StudentMarks.findAll({
      where: { exam_id },
      include: [{ model: SubjectComponent, where: { type: "EXAM" } }]
    });

    // Group by student_id and subject_id
    const grouped = {};
    marks.forEach(m => {
      const key = `${m.student_id}-${m.subject_id}`;
      if (!grouped[key]) grouped[key] = { student_id: m.student_id, subject_id: m.subject_id, marks: [] };
      grouped[key].marks.push(m);
    });

    const results = [];

    for (const key in grouped) {
      const { student_id, subject_id, marks: studentMarks } = grouped[key];

      // Determine if both internal and external components are present and passed
      const internalMark = studentMarks.find(m => m.SubjectComponent.component_name === "BACKLOG_INTERNAL");
      const externalMark = studentMarks.find(m => m.SubjectComponent.component_name === "BACKLOG_EXTERNAL");

      if (!internalMark || !externalMark) {
        // Skip if missing marks (maybe log a warning)
        continue;
      }

      const internalPass = internalMark.marks_obtained >= internalMark.SubjectComponent.min_marks;
      const externalPass = externalMark.marks_obtained >= externalMark.SubjectComponent.min_marks;
      const overallPass = internalPass && externalPass;

      // Find the backlog record
      const backlog = await Backlog.findOne({
        where: { student_id, subject_id, status: "ACTIVE" }
      });
      if (!backlog) continue; // should not happen

      const nextAttempt = backlog.total_attempts + 1;

      if (overallPass) {
        await backlog.update({
          cleared_exam_id: exam_id,
          total_attempts: nextAttempt,
          status: "CLEARED"
        }, { transaction: t });
      } else {
        await backlog.update({
          total_attempts: nextAttempt
        }, { transaction: t });
      }

      // Record the attempt (overall result)
      await BacklogAttempt.create({
        backlog_id: backlog.backlog_id,
        exam_id,
        attempt_number: nextAttempt,
        result_status: overallPass ? "PASS" : "FAIL"
      }, { transaction: t });

      results.push({
        student_id,
        subject_id,
        internal_marks: internalMark.marks_obtained,
        internal_pass: internalPass,
        external_marks: externalMark.marks_obtained,
        external_pass: externalPass,
        overall_pass: overallPass,
        attempt: nextAttempt
      });
    }

    await t.commit();

    res.json({
      success: true,
      message: "Backlog results generated",
      data: results
    });

  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 5. GET ACTIVE BACKLOGS (unchanged)
// ==========================================
export const getActiveBacklogs = async (req, res) => {
  try {
    const backlogs = await Backlog.findAll({
      where: { status: "ACTIVE" },
      include: [
        { model: Student, attributes: ["student_id", "name", "email"] },
        { model: Subject, attributes: ["subject_name", "credits"] },
        { model: Exam, as: "FirstFailedExam", attributes: ["exam_id", "name"] }
      ]
    });
    res.json({ success: true, data: backlogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 6. STUDENT BACKLOG HISTORY (unchanged)
// ==========================================
export const getStudentBacklogHistory = async (req, res) => {
  try {
    const { student_id } = req.params;
    const backlogs = await Backlog.findAll({
      where: { student_id },
      include: [
        { model: Subject, attributes: ["subject_name", "credits"] },
        { model: BacklogAttempt, include: [{ model: Exam, attributes: ["exam_id", "name"] }] }
      ]
    });
    res.json({ success: true, data: backlogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};