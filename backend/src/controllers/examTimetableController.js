import { Exam } from "../model/Exam.js";
import { Subject } from "../model/Subject.js";
import { ExamTimetable } from "../model/ExamTimetable.js";
import { sequelize } from "../config/db.js";

// =============================
// ADD SUBJECT TO EXAM
// =============================
export const addTimetable = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { exam_id, subject_id, exam_date, start_time, end_time } = req.body;

    if (!exam_id || !subject_id || !exam_date) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "exam_id, subject_id, exam_date required"
      });
    }

    // Check exam
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Check subject
    const subject = await Subject.findOne({
      where: { subject_id }
    });
    if (!subject) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Prevent duplicate
    const exists = await ExamTimetable.findOne({
      where: { exam_id, subject_id }
    });

    if (exists) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Subject already added in this exam"
      });
    }

    const timetable = await ExamTimetable.create({
      exam_id,
      subject_id,
      exam_date,
      start_time,
      end_time
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Timetable created",
      data: timetable
    });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};


// =============================
// GET ALL SUBJECTS OF EXAM
// =============================
export const getTimetableByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const data = await ExamTimetable.findAll({
      where: { exam_id },
      include: [
        { model: Subject, attributes: ["subject_id", "name"] }
      ],
      order: [["exam_date", "ASC"]]
    });

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =============================
// UPDATE TIMETABLE
// =============================
export const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await ExamTimetable.findByPk(id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found"
      });
    }

    await timetable.update(req.body);

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: timetable
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =============================
// DELETE TIMETABLE
// =============================
export const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await ExamTimetable.findByPk(id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found"
      });
    }

    await timetable.destroy();

    res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
