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

    const course_id = req.user?.course_id; // from auth middleware

    if (!course_id) {
      await t.rollback();
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

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
    // FETCH DATA (with course filtering)
    // =============================
    const [component, student, subject, exam] = await Promise.all([
      SubjectComponent.findByPk(component_id),
      Student.findOne({ where: { student_id, course_id } }),          // student must be in same course
      Subject.findOne({ where: { subject_id, course_id } }),          // subject must be in same course
      exam_id ? Exam.findOne({ where: { exam_id, course_id } }) : null // exam must be in same course
    ]);

    if (!component) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Component not found" });
    }

    if (!student) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Student not found or not in your course" });
    }

    if (!subject) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Subject not found or not in your course" });
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

    const examComponentTypes = ['INTERNAL', 'EXTERNAL', 'BACKLOG'];
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
        return res.status(404).json({ success: false, message: "Exam not found or not in your course" });
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

    // CASE 2: Continuous component
    else if (continuousComponentTypes.includes(component.type)) {
      if (exam_id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Exam ID is NOT allowed for ${component.type} component`
        });
      }
    }

    // Unsupported type
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

// ======================
// UPDATE MARKS CONTROLLER
// ======================
export const updateMarks = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      student_id,
      subject_id,
      exam_id,
      component_id,
      marks_obtained
    } = req.body;

    const course_id = req.user?.course_id;

    if (!course_id) {
      await t.rollback();
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    // Basic validation
    if (!student_id || !subject_id || !component_id || marks_obtained === undefined) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "student_id, subject_id, component_id, marks_obtained are required"
      });
    }

    if (marks_obtained < 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Marks cannot be negative" });
    }

    // Fetch data with course filtering
    const [component, student, subject, exam] = await Promise.all([
      SubjectComponent.findByPk(component_id),
      Student.findOne({ where: { student_id, course_id } }),
      Subject.findOne({ where: { subject_id, course_id } }),
      exam_id ? Exam.findOne({ where: { exam_id, course_id } }) : null
    ]);

    if (!component) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Component not found" });
    }
    if (!student) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Student not found or not in your course" });
    }
    if (!subject) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Subject not found or not in your course" });
    }

    // Component ↔ subject check
    if (component.subject_id !== subject_id) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Component does not belong to this subject" });
    }

    // Check if marks record exists
    const existingMarks = await StudentMarks.findOne({
      where: {
        student_id,
        subject_id,
        component_id,
        exam_id: examComponentTypes.includes(component.type) ? exam_id : null
      }
    });

    if (!existingMarks) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Marks record not found. Use enterMarks to create." });
    }

    // Additional check: if exam is published, prevent update
    if (examComponentTypes.includes(component.type) && exam && exam.status === "PUBLISHED") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Cannot update marks for a published exam" });
    }

    // Marks validation
    if (marks_obtained > component.max_marks) {
      await t.rollback();
      return res.status(400).json({ success: false, message: `Marks cannot exceed ${component.max_marks}` });
    }

    // Update
    await existingMarks.update({ marks_obtained }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      data: existingMarks
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// BULK MARKS ENTRY (Admin)
// ======================
export const bulkEnterMarks = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.user?.role !== 'Admin') {
      await t.rollback();
      return res.status(403).json({ success: false, message: "Access denied: Admin only" });
    }

    const { subject_id, exam_id, component_id, marks } = req.body;
    const course_id = req.user?.course_id;

    if (!course_id) {
      await t.rollback();
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    if (!subject_id || !component_id || !Array.isArray(marks) || marks.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "subject_id, component_id, and marks array are required" });
    }

    // Validate common fields
    const [component, subject, exam] = await Promise.all([
      SubjectComponent.findOne({ where: { component_id, subject_id } }),
      Subject.findOne({ where: { subject_id, course_id } }),
      exam_id ? Exam.findOne({ where: { exam_id, course_id } }) : null
    ]);

    if (!component) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Component not found or does not belong to the subject" });
    }
    if (!subject) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Subject not found or not in your course" });
    }

    // Component type handling
    const examComponentTypes = ['INTERNAL', 'EXTERNAL', 'BACKLOG'];
    const continuousComponentTypes = ['ASSIGNMENT', 'ATTENDANCE', 'QUIZ'];

    if (examComponentTypes.includes(component.type)) {
      if (!exam_id) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Exam ID required for ${component.type} component` });
      }
      if (!exam) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Exam not found or not in your course" });
      }
      const timetable = await ExamTimetable.findOne({ where: { exam_id, subject_id } });
      if (!timetable) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Subject NOT scheduled in this exam" });
      }
    } else if (continuousComponentTypes.includes(component.type)) {
      if (exam_id) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Exam ID NOT allowed for ${component.type} component` });
      }
    } else {
      await t.rollback();
      return res.status(400).json({ success: false, message: `Unsupported component type: ${component.type}` });
    }

    const storedExamId = examComponentTypes.includes(component.type) ? exam_id : null;
    const results = [];
    const errors = [];

    for (const entry of marks) {
      const { student_id, marks_obtained } = entry;
      try {
        if (!student_id || marks_obtained === undefined) {
          throw new Error("student_id and marks_obtained required in each entry");
        }
        if (marks_obtained < 0) throw new Error("Marks cannot be negative");
        if (marks_obtained > component.max_marks) throw new Error(`Marks cannot exceed ${component.max_marks}`);

        const student = await Student.findOne({ where: { student_id, course_id } });
        if (!student) throw new Error("Student not found or not in your course");

        const [record] = await StudentMarks.upsert({
          student_id,
          subject_id,
          exam_id: storedExamId,
          component_id,
          marks_obtained
        }, { transaction: t, returning: true });

        results.push(record);
      } catch (err) {
        errors.push({ student_id, error: err.message });
      }
    }

    if (errors.length > 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Bulk entry failed", errors });
    }

    await t.commit();
    return res.status(201).json({ success: true, message: "Bulk marks entered successfully", data: results });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};