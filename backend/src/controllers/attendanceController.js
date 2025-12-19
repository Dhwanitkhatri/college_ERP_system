import { Attendance } from "../model/Attendance.js";
import { sequelize } from "../config/db.js";

export const markAttendance = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    //  Role check
    const role = req.user.role;
    if (role !== "Faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      subject_id,
      class_id,
      lecture_no,
      date,
      attendance // array
    } = req.body;

    //  Basic validation
    if (
      !subject_id ||
      !class_id ||
      !lecture_no ||
      !date ||
      !Array.isArray(attendance) ||
      attendance.length === 0
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Check if attendance already marked
    const alreadyMarked = await Attendance.findOne({
      where: { subject_id, class_id, date, lecture_no }
    });

    if (alreadyMarked) {
      return res
        .status(409)
        .json({ message: "Attendance already marked for this lecture" });
    }

    //  Prepare bulk records
    const records = attendance.map(a => ({
      student_id: a.student_id,
      subject_id,
      class_id,
      faculty_id: req.user.uid,
      lecture_no,
      date,
      status: a.status
    }));

    // Bulk insert
    await Attendance.bulkCreate(records, { transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Attendance marked successfully"
    });

  } catch (error) {
    await t.rollback();

    //  Unique constraint safety
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Duplicate attendance detected" });
    }

    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { student_id, subject_id, class_id, date } = req.query;
    const whereClause = {};

    if (student_id) whereClause.student_id = student_id;
    if (subject_id) whereClause.subject_id = subject_id;
    if (class_id) whereClause.class_id = class_id;
    if (date) whereClause.date = date;

    const attendanceRecords = await Attendance.findAll({
      where: whereClause
    });

    return res.status(200).json({
      success: true,
      data: attendanceRecords
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { attendance_id } = req.params;
    const { status } = req.body;
    const attendanceRecord = await Attendance.findByPk(attendance_id);

    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    attendanceRecord.status = status;
    await attendanceRecord.save();
    return res.status(200).json({
      message: "Attendance updated successfully",
      data: attendanceRecord
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const deleteAttendance = async (req, res) => {
  try {
    const { attendance_id } = req.params;
    const attendanceRecord = await Attendance.findByPk(attendance_id);
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    await attendanceRecord.destroy();
    return res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};