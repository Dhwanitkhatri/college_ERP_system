// students report controller
import { Attendance } from "../model/Attendance.js";
import { Student } from "../model/Student.js";
import { Op } from "sequelize";

// Get date wise attendance report for a student
export const getStudentDateWiseReport = async (req, res) => {
  try {
    const { student_id, class_id, subject_id, month } = req.body;
    const course_id = req.user.course_id;

    // Validate required fields
    if (!student_id || !class_id || !subject_id || !month) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if student exists and belongs to the same course
    const student = await Student.findOne({ 
        where: { student_id, course_id },
        attributes: ['student_id','name', 'course_id']
     });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const [year,monthNum] = month.split("-").map(Number); // month in "YYYY-MM" format
    const startDate = new Date(year, monthNum - 1, 1);// first day of the month
    const endDate = new Date(year, monthNum, 0); // last day of the month

    // ADD TIME TO END DATE to include the full day
    endDate.setHours(23, 59, 59, 999);

    // Fetch attendance records for the specified month
    const attendanceRecords = await Attendance.findAll({
      where: {
        student_id,
        class_id,
        subject_id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
     
    //calculate total present, absent, late
    const totalPresent = attendanceRecords.filter(record => record.status === "Present").length;
    const totalAbsent = attendanceRecords.filter(record => record.status === "Absent").length;
    const totalLate = attendanceRecords.filter(record => record.status === "Late").length;
    const totalClasses = attendanceRecords.length;
    // Prepare response
    const report = {
      student: {
        student_id: student.student_id,
        name: student.name,
        course_id: student.course_id
        },
        filters: {
            class_id,
            subject_id,
            month,
            date_range: {
                from: startDate.toISOString().split('T')[0],
                to: endDate.toISOString().split('T')[0]
            },
            attendance_summary: {
                total_classes: totalClasses,
                total_present: totalPresent,
                total_absent: totalAbsent,
                total_late: totalLate
            }
        },
        attendance_records: attendanceRecords
    };
    res.json(report);
  } catch (error) {
    console.error("Error generating date wise report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

