import { Attendance } from "../model/Attendance.js";
import { sequelize } from "../config/db.js";

export const markAttendance = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    //  Role check
    const role ="Faculty"; //req.user.role;
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
      faculty_id: "BCAFAC001",
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
