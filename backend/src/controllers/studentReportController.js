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
    // Get query parameters
    const { student_id, class_id, subject_id, month } = req.query;
    const user_id = req.user.uid;
    const role = req.user.role;
    const course_id = req.user.course_id;

    // Validate required fields
    if (!student_id || !class_id || !subject_id || !month) {
      return res.status(400).json({
        message: "student_id, class_id, subject_id, and month are required."
      });
    }

    // Convert month to number
    const monthNum = Number(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: "Invalid month. Must be 1-12." });
    }

    // Check student existence
    const studentRecord = await Student.findOne({ where: { student_id, course_id } });
    if (!studentRecord) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Role-based access check
    if (!["Faculty", "Admin"].includes(role)) {
      return res.status(403).json({ message: "Access denied. Only Faculty and Admin can access this report." });
    }

    // If Faculty, get their username to filter
    let faculty_id = null;
    if (role === "Faculty") {
      const FacultyUser = await User.findOne({
        where: { user_id },
        attributes: ["username"]
      });
      faculty_id = FacultyUser ? FacultyUser.username : null;
    }

    // Verify the class
    const classRecord = await Class.findOne({
      where: { id: studentRecord.class_pk, course_id }
    });
    if (!classRecord) {
      return res.status(403).json({ message: "Student is not assigned to a valid class." });
    }
    if (Number(class_id) !== classRecord.id) {
      return res.status(403).json({ message: "Student does not belong to the requested class." });
    }

    // Extract academic year from class table
    if (!classRecord.academic_year || !classRecord.academic_year.includes("-")) {
      return res.status(500).json({ message: "Invalid academic year in class record." });
    }
    const [yearStartStr, yearEndStr] = classRecord.academic_year.split("-");
    const yearStart = Number(yearStartStr);
    const yearEnd = Number(yearEndStr);

    // Determine correct year for the month
    let year;
    if (monthNum >= 7) { // July-Dec → start year
      year = yearStart;
    } else {          // Jan-June → end year
      year = yearEnd;
    }

    // Build start and end dates for the month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Verify the subject
    const subjectRecord = await Subject.findOne({ where: { subject_id, course_id } });
    if (!subjectRecord) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // Build attendance query
    const whereClause = {
      student_id,
      class_id,
      subject_id,
      date: { [Op.between]: [startDateStr, endDateStr] }
    };
    if (role === "Faculty" && faculty_id) {
      whereClause.faculty_id = faculty_id;
    }

    // Fetch attendance records
    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
      order: [["date", "ASC"], ["lecture_no", "ASC"]]
    });

    // Attendance summary
    const totalClasses = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(r => r.status === "Present").length;
    const totalAbsent = attendanceRecords.filter(r => r.status === "Absent").length;
    const attendancePercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : "0.00";

    // Prepare detailed records
    const detailedRecords = attendanceRecords.map(r => ({
      attendance_id: r.attendance_id,
      date: r.date,
      day: new Date(r.date).toLocaleDateString("en-US", { weekday: "short" }),
      lecture_no: r.lecture_no,
      status: r.status,
      faculty_id: r.faculty_id
    }));

    // Prepare response
    const report = {
      success: true,
      student_info: {
        student_id: studentRecord.student_id,
        name: studentRecord.name,
        class_id: classRecord.class_id
      },
      subject_info: {
        subject_id: subjectRecord.subject_id,
        subject_name: subjectRecord.subject_name
      },
      report_info: {
        generated_by: role,
        faculty_id: faculty_id,
        month: `${year}-${monthNum.toString().padStart(2, "0")}`,
        date_range: { from: startDateStr, to: endDateStr }
      },
      attendance_summary: {
        total_classes: totalClasses,
        total_present: totalPresent,
        total_absent: totalAbsent,
        attendance_percentage: attendancePercentage,
        attendance_rating: attendancePercentage >= 50 ? "Good" : "Poor"
      },
      detailed_records: detailedRecords
    };

    return res.status(200).json({
      message: "Student month-wise attendance report fetched successfully.",
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
      attributes: ['class_id',  'semester', 'id' ]
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

export const getSubjectsAndStudentForDatewiseReport = async (req, res) => {
  try {
    // Read from query
    const semesterNumber = Number(req.query.semester);
    const class_id = Number(req.query.class_id);

    const course_id = req.user.course_id;

    //  Validation
    if (Number.isNaN(semesterNumber) || Number.isNaN(class_id)) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    const subjects = await Subject.findAll({
      where: { course_id, semester: semesterNumber },
      attributes: ["subject_id", "subject_name"],
    });

    const students = await Student.findAll({
      where: { course_id, class_pk: class_id },
      attributes: ["student_id", "name"],
    });

    console.log("Class ID:", class_id);
    console.log("Semester Number:", semesterNumber);
    console.log("Course ID:", course_id);

    return res.status(200).json({
      message: "Subjects and students fetched successfully.",
      subjects,
      students,
    });
  } catch (error) {
    console.error("Error fetching subjects for date-wise report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getOverallClassAttendancereport = async (req, res) => {
  try {
    const { class_id } = req.query;

    if (!class_id) {
      return res.status(400).json({
        message: "class_id is required"
      });
    }

    const classRecord = await Class.findOne({
      where: { class_id },
      include: [{
        model: User,
        as: "mentor",
        attributes: ["username"]
      }]
    });

    if (!classRecord) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    const students = await Student.findAll({
      where: { class_pk :classRecord.id },
      order: [["student_id", "ASC"]]
    });

    if (!students.length) {
      return res.status(404).json({
        message: "No students found in class"
      });
    }

    const studentIds = students.map(s => s.student_id);

    const attendanceRecords = await Attendance.findAll({
      where: {
        class_id : classRecord.id,
        student_id: { [Op.in]: studentIds }
      },
      include: [
        {
          model: Subject,
          as: "Subject",
          attributes: ["subject_id", "subject_name"]
        },
        {
          model: User,
          as: "Faculty",
          attributes: ["username"]
        }
      ],
      order: [["date", "ASC"], ["student_id", "ASC"]]
    });

    const studentMap = {};
    const subjectSummary = {};
    const facultySummary = {};
    const monthlySummary = {};
    const uniqueDates = new Set();

    students.forEach(s => {
      studentMap[s.student_id] = {
        student_id: s.student_id,
        name: s.name,
        total_classes: 0,
        present: 0,
        absent: 0,
        subject_wise: {},
        faculty_wise: {},
        monthly_attendance: {}
      };
    });

    attendanceRecords.forEach(r => {
      const student = studentMap[r.student_id];
      if (!student) return;

      const date = new Date(r.date);
      const dateStr = date.toISOString().split("T")[0];
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const subjectId = r.Subject.subject_id;
      const facultyName = r.Faculty.username;

      uniqueDates.add(dateStr);

      student.total_classes++;
      r.status === "Present" ? student.present++ : student.absent++;

      /* Subject-wise */
      student.subject_wise[subjectId] ??= {
        subject_name: r.Subject.subject_name,
        total_classes: 0,
        present: 0,
        absent: 0
      };
      const sw = student.subject_wise[subjectId];
      sw.total_classes++;
      r.status === "Present" ? sw.present++ : sw.absent++;

      /* Faculty-wise */
      student.faculty_wise[facultyName] ??= {
        total_classes: 0,
        present: 0,
        absent: 0
      };
      const fw = student.faculty_wise[facultyName];
      fw.total_classes++;
      r.status === "Present" ? fw.present++ : fw.absent++;

      /* Monthly */
      student.monthly_attendance[monthStr] ??= {
        total_classes: 0,
        present: 0,
        absent: 0
      };
      const mw = student.monthly_attendance[monthStr];
      mw.total_classes++;
      r.status === "Present" ? mw.present++ : mw.absent++;

       
      subjectSummary[subjectId] ??= {
        subject_name: r.Subject.subject_name,
        total_classes: 0,
        present: 0,
        absent: 0
      };
      subjectSummary[subjectId].total_classes++;
      r.status === "Present"
        ? subjectSummary[subjectId].present++
        : subjectSummary[subjectId].absent++;

      facultySummary[facultyName] ??= {
        faculty: facultyName,
        total_classes: 0,
        present: 0,
        absent: 0
      };
      facultySummary[facultyName].total_classes++;
      r.status === "Present"
        ? facultySummary[facultyName].present++
        : facultySummary[facultyName].absent++;

      monthlySummary[monthStr] ??= {
        month: monthStr,
        total_classes: 0,
        present: 0,
        absent: 0
      };
      monthlySummary[monthStr].total_classes++;
      r.status === "Present"
        ? monthlySummary[monthStr].present++
        : monthlySummary[monthStr].absent++;
    });

    return res.status(200).json({
      success: true,
      class_info: {
        class_id: classRecord.class_id,
        mentor: classRecord.mentor?.username
      },
      summary: {
        total_students: students.length,
        working_days: uniqueDates.size
      },
      students: Object.values(studentMap),
      subject_wise_summary: Object.values(subjectSummary),
      faculty_wise_summary: Object.values(facultySummary),
      monthly_breakdown: Object.values(monthlySummary)
    });

  } catch (error) {
    console.error("Overall Attendance Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
