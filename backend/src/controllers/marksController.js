import { StudentMarks } from "../model/StudentMarks.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { Student } from "../model/Student.js";
import { Exam } from "../model/Exam.js";
import { Subject } from "../model/Subject.js";
import { ExamTimetable } from "../model/ExamTimetable.js";
import { sequelize } from "../config/db.js";

// ======================
// ENTER MARKS CONTROLLER
// ======================
export const enterMarks = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      student_id,
      subject_id,
      exam_id,
      component_id,
      marks_obtained
    } = req.body;

    // =============================
    // BASIC VALIDATION
    // =============================
    if (!student_id || !subject_id || !component_id || marks_obtained === undefined) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "student_id, subject_id, component_id, marks_obtained are required"
      });
    }

    if (marks_obtained < 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Marks cannot be negative"
      });
    }

    // =============================
    // FETCH DATA
    // =============================
    const [component, student, subject, exam] = await Promise.all([
      SubjectComponent.findByPk(component_id),
      Student.findOne({ where: { student_id } }),
      Subject.findOne({ where: { subject_id } }),
      exam_id ? Exam.findByPk(exam_id) : null
    ]);

    if (!component) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Component not found" });
    }

    if (!student) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!subject) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // =============================
    // COMPONENT ↔ SUBJECT CHECK
    // =============================
    if (component.subject_id !== subject_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Component does not belong to this subject"
      });
    }

    // =============================
    // COMPONENT TYPE HANDLING
    // =============================

    // Define which component types require an exam_id and timetable validation
    const examComponentTypes = ['INTERNAL', 'EXTERNAL', 'BACKLOG'];  // Add more if needed
    const continuousComponentTypes = ['ASSIGNMENT', 'ATTENDANCE', 'QUIZ'];

    // CASE 1: Exam‑type component
    if (examComponentTypes.includes(component.type)) {
      if (!exam_id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Exam ID is required for ${component.type} component`
        });
      }

      if (!exam) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Exam not found" });
      }

      // Verify that this subject is actually scheduled in this exam
      const timetable = await ExamTimetable.findOne({
        where: { exam_id, subject_id }
      });

      if (!timetable) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "This subject is NOT scheduled in the given exam"
        });
      }
    }

    // CASE 2: Continuous component (attendance, assignment, quiz)
    else if (continuousComponentTypes.includes(component.type)) {
      // These components should NOT have an exam_id
      if (exam_id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Exam ID is NOT allowed for ${component.type} component`
        });
      }
    }

    // If some other type appears (shouldn't happen if enum is correct), reject
    else {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Unsupported component type: ${component.type}`
      });
    }

    // =============================
    // MARKS VALIDATION
    // =============================
    if (marks_obtained > component.max_marks) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed ${component.max_marks}`
      });
    }

    // =============================
    // UPSERT MARKS
    // =============================
    // For exam‑type components, store exam_id; for continuous, store null
    const storedExamId = examComponentTypes.includes(component.type) ? exam_id : null;

    const [record, created] = await StudentMarks.upsert({
      student_id,
      subject_id,
      exam_id: storedExamId,
      component_id,
      marks_obtained
    }, {
      transaction: t,
      returning: true
    });

    await t.commit();

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Marks created successfully" : "Marks updated successfully",
      data: record
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};