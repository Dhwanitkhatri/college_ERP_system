import { Attendance } from "../model/Attendance.js";
import { sequelize } from "../config/db.js";
import { Student } from "../model/Student.js";
import { Subject } from "../model/Subject.js";
import { Timetable } from "../model/Timetable.js";
import { Class } from "../model/Class.js";
import { User } from "../model/User.js";
import {Faculty} from "../model/Faculty.js"

export const markAttendance = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    //  Role check
    const role = req.user.role;
    const userId = req.user.uid;
    if (role !== "Faculty") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get faculty ID from user
    const facultyUser = await User.findOne({
      where: { user_id: userId },
      attributes: ['username']
    });

    if (!facultyUser) {
      return res.status(404).json({
        success: false,
        message: "Faculty user not found"
      });
    }

    const faculty_id = facultyUser.username;

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



    const records = attendance.map(({ student_id, status }) => ({
      student_id,
      subject_id,
      class_id,
      faculty_id,
      lecture_no,
      date,
      status
    }));

    console.log("class_id from frontend:", class_id);
    console.log("subject_id:", subject_id);
    console.log("faculty_id:", faculty_id);
    console.log("lecture_no:", lecture_no);
    console.log("date:", date);
    console.log("REQ BODY:", req.body);


    const result = await Attendance.bulkCreate(records, { transaction: t, validate: true });
    console.log("result length ", result.length)

    await t.commit();

    return res.status(201).json({
      message: "Attendance marked successfully",
      data: result
    });

  } catch (error) {
    await t.rollback();
    console.error("FULL ERROR:", error);


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

export const getAttendance  = async (req, res) => {
  try {
    const { class_id, subject_id, lecture_no, date } = req.params;
    const faculty = await Faculty.findOne({where:{user_id:req.user.uid}})

    if (!class_id || !subject_id || !lecture_no || !date) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const students = await Student.findAll({
      where: { class_pk :class_id },
      include: [
        {
          model: Attendance,
          required: false, // LEFT JOIN
          where: {
            subject_id,
            lecture_no,
            date,
          
          }
        }
      ]
    });

    const formatted = students.map(student => {
      const attendanceRecord = student.Attendances[0];

      return {
        student_id: student.student_id,
        name: student.name,
        status: attendanceRecord ? attendanceRecord.status : "Absent"
      };
    });

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};




export const updateAttendance = async (req, res) => {
  try {
    const {
      class_id,
      subject_id,
      lecture_no,
      date,
      students,
    } = req.body;

    if (!class_id || !subject_id || !lecture_no || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Students array is required",
      });
    }

  
    const faculty = await Faculty.findOne({
      where: { user_id: req.user.uid },
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    
    const faculty_id = faculty.faculty_id;

    console.log("Faculty ID:", faculty_id);

    
    const attendanceData = students.map((student) => ({
      student_id: student.student_id,
      subject_id,
      faculty_id, // now correct
      class_id,
      lecture_no,
      date,
      status: student.status,
    }));

    await Attendance.bulkCreate(attendanceData, {
      updateOnDuplicate: ["status", "updatedAt"],
    });

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
    });

  } catch (error) {
    console.error("Update Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
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

export const getStudentByClass = async (req, res) => {
  try {
    const { class_id } = req.params;

    const students = await Student.findAll({
      where: { class_pk: class_id }
    });

    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getSubjectsByFacultyAndClass = async (req, res) => {
  try {
    const { class_id, date } = req.params;

    // Convert date to day name
    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const userId = req.user.uid;

    const facultyUser = await User.findOne({
      where: { user_id: userId },
      attributes: ["username"]
    });

    if (!facultyUser) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const faculty_id = facultyUser.username;


    const subjects = await Subject.findAll({
      attributes: ["subject_id", "subject_name"],
      include: [
        {
          model: Timetable,
          where: {
            class_pk: class_id,
            faculty_id: faculty_id,
            day_of_week: dayName,
          },
          attributes: [],
        },
      ],
      distinct: true,
    });

    return res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const getClasses = async (req, res) => {
  try {
    const course_id = req.user.course_id;
    const classes = await Class.findAll({
      where: { course_id }
    });
    return res.json({ success: true, data: classes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLecturesBySubjectAndDate = async (req, res) => {
  try {
    const { class_id, subject_id, date } = req.params;

    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const userId = req.user.uid;

    const facultyUser = await User.findOne({
      where: { user_id: userId },
      attributes: ["username"]
    });

    if (!facultyUser) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const faculty_id = facultyUser.username;


    const lectureCount = await Timetable.count({
      where: {
        faculty_id,
        class_pk: class_id,
        subject_id,
        day_of_week: dayName,
      },
    });

    return res.json({
      success: true,
      count: lectureCount,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
