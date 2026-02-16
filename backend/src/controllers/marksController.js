import { StudentMarks } from "../model/StudentMarks.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { Student } from "../model/Student.js";
import { Exam } from "../model/Exam.js";
import { Subject } from "../model/Subject.js";
import { sequelize } from "../config/db.js";

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

    // Basic Validation (Required fields + Marks non-negative)
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

    // Parallel Fetch 
    const [component, student, exam] = await Promise.all([
      SubjectComponent.findByPk(component_id),
      Student.findOne({ where: { student_id } }),
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

    // If EXAM type → exam_id required
    if (component.type === "EXAM") {
      if (!exam_id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Exam ID is required for EXAM components"
        });
      }

      if (!exam) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Exam not found"
        });
      }
    }

    // Subject Existence Check
    const subject = await Subject.findOne({ where: { subject_id } });
    if (!subject) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // Subject validation
    if (component.subject_id !== subject_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Component does not belong to this subject"
      });
    }

    // Marks validation
    if (marks_obtained > component.max_marks) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed ${component.max_marks}`
      });
    }

    //  UPSERT
    const [record, created] = await StudentMarks.upsert({
      student_id,
      subject_id,
      exam_id: exam_id || null,
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
