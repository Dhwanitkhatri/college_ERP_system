import { StudentMarks } from "../model/StudentMarks.js";
import { SubjectComponent } from "../model/SubjectComponent.js";
import { Student } from "../model/Student.js";
import { Exam } from "../model/Exam.js";
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

    //  Basic Validation
    if (!student_id || !subject_id || !exam_id || !component_id || marks_obtained === undefined) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (marks_obtained < 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Marks cannot be negative"
      });
    }

    // Parallel DB Checks (Optimized for performance)
    const [component, student, exam] = await Promise.all([
      SubjectComponent.findByPk(component_id),
      Student.findOne({ where: { student_id } }),
      Exam.findByPk(exam_id)
    ]);

    if (!component) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Component not found" });
    }

    if (!student) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!exam) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Subject Match Check
    if (component.subject_id !== subject_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Component does not belong to this subject"
      });
    }

    // Marks Validation
    if (marks_obtained > component.max_marks) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed ${component.max_marks}`
      });
    }

    // Upsert (Insert or Update)
    const [record, created] = await StudentMarks.upsert({
      student_id,
      subject_id,
      exam_id,
      component_id,
      marks_obtained
    }, {
      transaction: t,
      returning: true
    });

    // Commit Transaction
    await t.commit();

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Marks created successfully" : "Marks updated successfully",
      data: record
    });

  } catch (error) {
    await t.rollback();

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry detected"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
