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
    const course_id = req.user?.course_id; 

    if (!course_id) {
      await t.rollback();
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    if (!exam_id || !subject_id || !exam_date) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "exam_id, subject_id, exam_date required"
      });
    }

    // Check exam exists and belongs to the same course
    const exam = await Exam.findOne({
      where: { exam_id, course_id }
    });
    if (!exam) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Exam not found or not in your course" });
    }

    // Optional: allow only if exam is DRAFT
    if (exam.status !== "DRAFT") {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Cannot modify a published exam" });
    }

    // Check subject exists and belongs to the same course
    const subject = await Subject.findOne({
      where: { subject_id, course_id }
    });
    if (!subject) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Subject not found or not in your course" });
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
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    // First verify exam belongs to this course
    const exam = await Exam.findOne({
      where: { exam_id, course_id }
    });
    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const data = await ExamTimetable.findAll({
      where: { exam_id },
      include: [
        {
          model: Subject,
          where: { course_id }, 
          attributes: ["subject_id", "subject_name"]
        }
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
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    // Fetch timetable with exam and subject to verify course ownership
    const timetable = await ExamTimetable.findByPk(id, {
      include: [
        { model: Exam, attributes: ["course_id", "status"] },
        { model: Subject, attributes: ["course_id"] }
      ]
    });

    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    // Check that both exam and subject belong to the user's course
    if (timetable.Exam?.course_id !== course_id || timetable.Subject?.course_id !== course_id) {
      return res.status(403).json({ success: false, message: "Access denied: Not your course" });
    }

    // Allow update only if exam is still DRAFT
    if (timetable.Exam?.status !== "DRAFT") {
      return res.status(400).json({ success: false, message: "Cannot update a published exam's timetable" });
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
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    // Fetch timetable with exam to verify ownership and status
    const timetable = await ExamTimetable.findByPk(id, {
      include: [{ model: Exam, attributes: ["course_id", "status"] }]
    });

    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    // Check exam belongs to user's course
    if (timetable.Exam?.course_id !== course_id) {
      return res.status(403).json({ success: false, message: "Access denied: Not your course" });
    }

    // Allow delete only if exam is DRAFT
    if (timetable.Exam?.status !== "DRAFT") {
      return res.status(400).json({ success: false, message: "Cannot delete from a published exam" });
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