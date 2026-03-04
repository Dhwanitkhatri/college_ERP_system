import { Exam } from "../model/Exam.js";
import { StudentMarks } from "../model/StudentMarks.js";

// =============================
// CREATE EXAM
// =============================
export const createExam = async (req, res) => {
  try {
    const { name, exam_type, semester, academic_year } = req.body;
    const course_id = req.user?.course_id; // from auth middleware

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    if (!name || !exam_type || !semester || !academic_year) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const validExamTypes = ['REGULAR', 'RE-EXAM', 'IMPROVEMENT'];
    if (!validExamTypes.includes(exam_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam_type"
      });
    }

    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8"
      });
    }

    const exam = await Exam.create({
      course_id,
      name,
      exam_type,
      semester,
      academic_year,
      status: "DRAFT"
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam
    });

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Exam already exists with same details in this course"
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// GET ALL EXAMS (with filters) – scoped to course
// =============================
export const getAllExams = async (req, res) => {
  try {
    const course_id = req.user?.course_id;
    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const { status, exam_type, semester, academic_year, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const where = { course_id }; // always filter by course
    if (status) where.status = status;
    if (exam_type) where.exam_type = exam_type;
    if (semester) where.semester = semester;
    if (academic_year) where.academic_year = academic_year;

    const { count, rows } = await Exam.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parsedLimit,
      offset: (parsedPage - 1) * parsedLimit
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parsedPage,
        totalPages: Math.ceil(count / parsedLimit),
        limit: parsedLimit
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// GET SINGLE EXAM (with course check)
// =============================
export const getExamById = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const exam = await Exam.findOne({
      where: { exam_id, course_id }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    return res.status(200).json({ success: true, data: exam });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// UPDATE EXAM (Only DRAFT + course check)
// =============================
export const updateExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const updates = req.body;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const exam = await Exam.findOne({
      where: { exam_id, course_id }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (exam.status === "PUBLISHED") {
      return res.status(400).json({ success: false, message: "Cannot update a published exam" });
    }

    if (updates.status) {
      return res.status(400).json({ success: false, message: "Status cannot be updated from here" });
    }

    const allowedFields = ["name", "exam_type", "semester", "academic_year"];
    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) filteredUpdates[field] = updates[field];
    });

    await exam.update(filteredUpdates);

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam
    });

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Duplicate exam details in this course" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// DELETE EXAM (Only DRAFT + course check)
// =============================
export const deleteExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const exam = await Exam.findOne({
      where: { exam_id, course_id }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (exam.status === "PUBLISHED") {
      return res.status(400).json({ success: false, message: "Cannot delete published exam" });
    }

    await exam.destroy();

    return res.status(200).json({ success: true, message: "Exam deleted successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// PUBLISH EXAM (LOCK SYSTEM + course check)
// =============================
export const publishExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const course_id = req.user?.course_id;

    if (!course_id) {
      return res.status(403).json({ success: false, message: "Access denied: No course associated" });
    }

    const exam = await Exam.findOne({
      where: { exam_id, course_id }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (exam.status === "PUBLISHED") {
      return res.status(400).json({ success: false, message: "Exam already published" });
    }

    // Ensure marks exist before publishing
    const marksCount = await StudentMarks.count({
      where: { exam_id }
    });

    if (marksCount === 0) {
      return res.status(400).json({ success: false, message: "Cannot publish exam without marks" });
    }

    await exam.update({ status: "PUBLISHED" });

    return res.status(200).json({
      success: true,
      message: "Exam published successfully",
      data: exam
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

