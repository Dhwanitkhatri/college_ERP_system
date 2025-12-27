// students report controller
import { Attendance } from "../model/Attendance.js";
import { Student } from "../model/Student.js";
import { Op } from "sequelize";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";
import { User } from "../model/User.js";

// Get date wise attendance report for a student
export const getStudentDateWiseReport = async (req, res) => {
  try {
    const { student_id, class_id, subject_id, month } = req.body;
    const user_id = req.user.uid;
    const role = req.user.role;
    const course_id = req.user.course_id;

    // Validate required fields
    if (!student_id || !class_id || !subject_id || !month) {
      return res.status(400).json({ message: "student_id, class_id, subject_id, and month are required." });
    }

    // student existence check
    const studentRecord = await Student.findOne({ where: { student_id, course_id } });

    if (!studentRecord) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Only Faculty and Admin can access
    if (!["Faculty", "Admin"].includes(role)) {
      return res.status(403).json({ message: "Access denied. Only Faculty and Admin can access this report." });
    }
    const FacultyUser = await User.findOne({
      where: { user_id: user_id },
      attributes: ['username']
    });
    const faculty_id = FacultyUser ? FacultyUser.username : null;

    // Verify that the class belongs to the faculty
    const classRecord = await Class.findOne({
      where: {
        id: studentRecord.class_pk,
        course_id
      }
    });

    if (!classRecord) {
      return res.status(403).json({
        message: "Student is not assigned to a valid class."
      });
    }
    // Verify that the student belongs to the requested class
    if (class_id !== classRecord.class_id) {
      return res.status(403).json({
        message: "Student does not belong to the requested class."
      });
    }
    // Subject existence check
    const subjectRecord = await Subject.findOne({ where: { subject_id, course_id } });
    if (!subjectRecord) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // parse month to get dtaes
    const [year, monthNum] = month.split("-").map(Number); // month in "YYYY-MM" format
    const startDate = new Date(year, monthNum - 1, 1); // first day of month
    const endDate = new Date(year, monthNum, 0); // last day of month

    const startDateStr = startDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const endDateStr = endDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Fetch attendance records for the student in the specified month
    const attendanceRecords = await Attendance.findAll({
      where: {
        student_id,
        class_id,
        subject_id,
        faculty_id,
        date: {
          [Op.between]: [startDateStr, endDateStr]
        }
      },
      order: [['date', 'ASC'], ['lecture_no', 'ASC']]
    });

    // calculate total
    const totalPresent = attendanceRecords.filter(record => record.status === 'Present').length;
    const totalAbsent = attendanceRecords.filter(record => record.status === 'Absent').length;
    const totalClasses = attendanceRecords.length;
    const attendancePercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : "0.00";

    // Group attendance by date
    const attendanceByDate = {};
    for (const record of attendanceRecords) {
      const dateStr = record.date;
      if (!attendanceByDate[dateStr]) {
        attendanceByDate[dateStr] = [];
      }
      // Push lecture info
      attendanceByDate[dateStr].push({
        lecture_no: record.lecture_no,
        status: record.status
      });
    }
    //get all dates in month
    // const allDatesInMonth = [];
    // const currentDate = new Date(startDate);
    // while (currentDate <= endDate) {
    //   const dateStr = currentDate.toISOString().split('T')[0];
    //   allDatesInMonth.push(dateStr);
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

    // // create daily attendance summary
    // const dailyAttendanceSummary = allDatesInMonth.map(date => {
    //   const dayRecords = attendanceByDate[date] || [];
    //   const dayOfWeek = new Date(date).getDay(); // 0 (Sun) to 6 (Sat)
    //   const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6); // assuming weekend is Saturday and Sunday

    //   let dayStatus = 'No Record';
    //   if (dayRecords.length > 0) {
    //     if(dayRecords.every(r => r.status === 'Present')) {
    //       dayStatus = 'Present';
    //     } else if(dayRecords.every(r => r.status === 'Absent')) {
    //       dayStatus = 'Absent';
    //     } else {
    //       dayStatus = 'Mixed';
    //     }
    //   }
    //   return {
    //     date: date,
    //     day :  new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    //     is_weekend: isWeekend,
    //     lecture : dayRecords,
    //     status: dayStatus
    //   };
    // });

    //prepare response
    const report = {
      sucess: true,
      student_info: {
        student_id: studentRecord.student_id,
        name: studentRecord.name,
        class_id: classRecord.class_id,
        faculty_id: faculty_id
      },
      subject_info: {
        subject_id: subjectRecord.subject_id,
        subject_name: subjectRecord.subject_name,
      },
      attendance_summary: {
        total_classes: totalClasses,
        total_present: totalPresent,
        total_absent: totalAbsent,
        attendance_percentage: attendancePercentage,
        attendance_rating: attendancePercentage >= 50 ? "Good" : "Poor"
      },
      //daily_attendance: dailyAttendanceSummary,
      detailed_records: attendanceRecords.map(record => ({
        attendance_id: record.attendance_id,
        date: record.date,
        day: new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }),
        lecture_no: record.lecture_no,
        status: record.status
      }))
    };


    return res.status(200).json({
      message: "Student date-wise attendance report fetched successfully.",
      data: report
    });
  } catch (error) {
    console.error("Error fetching student date-wise report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


