// students report controller
import { Attendance } from "../model/Attendance.js";
import { Student } from "../model/Student.js";
import { Op } from "sequelize";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";
import { User } from "../model/User.js";
import{getSemesterType} from "../services/academicYear.js";

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
    // Get faculty username for Faculty role
    let faculty_id = null;
    if (role === "Faculty") {
      const FacultyUser = await User.findOne({
        where: { user_id: user_id },
        attributes: ['username']
      });
      faculty_id = FacultyUser ? FacultyUser.username : null;
    }

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

    // Build where clause for attendance query
    const whereClause = {
      student_id,
      class_id,
      subject_id,
      date: {
        [Op.between]: [startDateStr, endDateStr]
      }
    };

    // If user is Faculty, filter by their attendance only
    if (role === "Faculty" && faculty_id) {
      whereClause.faculty_id = faculty_id;
    }

    // Fetch attendance records for the student in the specified month
    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
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
    //get all dates in month(calendar view)
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
        class_id: classRecord.class_id
      },
      subject_info: {
        subject_id: subjectRecord.subject_id,
        subject_name: subjectRecord.subject_name,
      },
      report_info: {
        generated_by: role,
        faculty_id: faculty_id,
        month: month,
        date_range: {
          from: startDateStr,
          to: endDateStr
        }
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
        status: record.status,
        faculty_id: record.faculty_id
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

// Class-wise attendance report for all students in a class
export const getClassWiseReport = async (req, res) => {
  try {
    const { class_id, subject_id } = req.body;
    const user_id = req.user.uid;
    const role = req.user.role;
    const course_id = req.user.course_id;

    // Validate required fields
    if (!class_id || !subject_id) {
      return res.status(400).json({ message: "class_id and subject_id are required." });
    }

    // Only Faculty and Admin can access
    if (!["Faculty", "Admin"].includes(role)) {
      return res.status(403).json({ message: "Access denied. Only Faculty and Admin can access this report." });
    }

    // Get faculty username
    let faculty_id = null;
    if (role === "Faculty") {
      const FacultyUser = await User.findOne({
        where: { user_id: user_id },
        attributes: ['username']
      });
      faculty_id = FacultyUser ? FacultyUser.username : null;
    }

    // Verify that the class exists
    const classRecord = await Class.findOne({
      where: {
        class_id,
        course_id
      }
    });
    if (!classRecord) {
      return res.status(404).json({ message: "Class not found." });
    }
    
    // Subject existence check
    const subjectRecord = await Subject.findOne({ 
      where: { subject_id, course_id } 
    });
    if (!subjectRecord) {
      return res.status(404).json({ message: "Subject not found." });
    }
    
    // Get all students in the class
    const students = await Student.findAll({
      where: { class_pk: classRecord.id, course_id }
    });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found in the specified class." });
    }

    const studentIds = students.map(s => s.student_id);

    // Build whereClause
    const whereClause = {
      student_id: { [Op.in]: studentIds },
      class_id,
      subject_id,
    };

    // If faculty, filter by faculty_id
    if (role === "Faculty" && faculty_id) {
      whereClause.faculty_id = faculty_id;
    }

    // Fetch attendance records for all students in the class
    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
      order: [['student_id', 'ASC'], ['date', 'ASC'], ['lecture_no', 'ASC']]
    });

    // Prepare report data
    const studentReports = students.map(student => {
      const studentAttendance = attendanceRecords.filter(record => record.student_id === student.student_id);

      // Calculate totals
      const totalPresent = studentAttendance.filter(record => record.status === 'Present').length;
      const totalAbsent = studentAttendance.filter(record => record.status === 'Absent').length;
      const totalClasses = studentAttendance.length;
      const attendancePercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : "0.00";

      // Get unique dates when attendance was taken 
      const attendanceDatesSet = new Set();
      for (const record of studentAttendance) {
        attendanceDatesSet.add(record.date);
      }
      
      const attendanceDates = Array.from(attendanceDatesSet).sort((dateA, dateB) => {
        return new Date(dateA) - new Date(dateB);
      });

      return {
        student_id: student.student_id,
        name: student.name,
        total_attendance: {
          classes_conducted: totalClasses,
          total_present: totalPresent,
          total_absent: totalAbsent,
          attendance_percentage: attendancePercentage,
        },
        attendance_dates: attendanceDates
      };
    });

    // Calculate class totals
    let classTotalClasses = 0;
    let classTotalPresent = 0;
    let classTotalAbsent = 0;

    for (const report of studentReports) {
      classTotalClasses += Number.parseInt(report.total_attendance.classes_conducted, 10) || 0;
      classTotalPresent += Number.parseInt(report.total_attendance.total_present, 10) || 0;
      classTotalAbsent += Number.parseInt(report.total_attendance.total_absent, 10) || 0;
    }

    const classAttendancePercentage = classTotalClasses > 0 ? 
      ((classTotalPresent / classTotalClasses) * 100).toFixed(2) : "0.00";
    
    // Get unique all dates 
    const allDatesSet = new Set();
    for (const record of attendanceRecords) {
      allDatesSet.add(record.date);
    }
    
    const allAttendanceDates = Array.from(allDatesSet).sort((dateA, dateB) => {
      return new Date(dateA) - new Date(dateB);
    });

    // Prepare response
    const report = {
      success: true,
      message: "Class-wise attendance report generated successfully.",
      class_info: {
        class_id: classRecord.class_id,
        year: classRecord.year,
        section: classRecord.section,
        semester: classRecord.semester,
        academic_year: classRecord.academic_year
      },
      subject_info: {
        subject_id: subjectRecord.subject_id,
        subject_name: subjectRecord.subject_name,
      },
      report_info: {
        generated_by: role, 
        faculty_id: faculty_id,
        total_attendance_dates: allAttendanceDates.length,
        attendance_dates: allAttendanceDates
      },
      class_summary: {
        total_students: students.length,
        total_classes_conducted: classTotalClasses,
        total_present: classTotalPresent,
        total_absent: classTotalAbsent,
        class_attendance_percentage: `${classAttendancePercentage}%`,
        rating :  classAttendancePercentage >= 50 ? "Good" : "Poor"
      },
      student_reports: studentReports
    };
    
    return res.status(200).json(report);
    
  } catch (error) {
    console.error("Error fetching class-wise report:", error);
    return res.status(500).json({ 
      message: "Internal server error.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const getClassesForDatewiseReport = async (req, res) => {
  try {
    const course_id = req.user.course_id;
    const semesterType = getSemesterType();
    const semester = semesterType === "odd" ? ["1", "3", "5", "7"] : ["2", "4", "6", "8"];
    const classes = await Class.findAll({
      where: { course_id , semester: { [Op.in]: semester } },
      attributes: ['class_id', 'year', 'section', 'semester', 'academic_year']
    });
    return res.status(200).json({
      message: "Classes fetched successfully.",
      data: classes
    });
  } catch (error) {
    console.error("Error fetching classes for date-wise report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};