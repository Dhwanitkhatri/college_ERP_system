// students report controller
import { Attendance } from "../model/Attendance.js";
import { Student } from "../model/Student.js";
import { Op } from "sequelize";
import { Class } from "../model/Class.js";
import { Subject } from "../model/Subject.js";
import { User } from "../model/User.js";
import { getSemesterType } from "../services/academicYear.js";
import { Faculty } from "../model/Faculty.js";

// Get date wise attendance report for a student
export const getStudentDateWiseReport = async (req, res) => {
  try {
    const { student_id, class_id, subject_id, month } = req.query;
    const user_id = req.user.uid;
    const role = req.user.role;
    const course_id = req.user.course_id;
    console.log(req.query);
    // Required fields check
    if (!student_id || !class_id || !subject_id || !month) {
      return res.status(400).json({
        message: "student_id, class_id, subject_id, and month are required."
      });
    }

    // Check student
    const studentRecord = await Student.findOne({
      where: { student_id, course_id }
    });

    if (!studentRecord) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Role check
    if (!["Faculty", "Admin"].includes(role)) {
      return res.status(403).json({
        message: "Access denied. Only Faculty/Admin allowed."
      });
    }

    // Faculty username if role faculty
    let faculty_id = null;
    if (role === "Faculty") {
      const facultyUser = await User.findOne({
        where: { user_id },
        attributes: ["username"]
      });
      faculty_id = facultyUser?.username || null;
    }

    // Verify class
    const classRecord = await Class.findOne({
      where: { id: studentRecord.class_pk, course_id },
      attributes: ["id", "class_id", "academic_year"]
    });

    if (!classRecord) {
      return res.status(403).json({
        message: "Student not assigned to valid class."
      });
    }

    if (Number(class_id) !== classRecord.id) {
      return res.status(403).json({
        message: "Student does not belong to requested class."
      });
    }

    // Verify subject
    const subjectRecord = await Subject.findOne({
      where: { subject_id, course_id }
    });

    if (!subjectRecord) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // -------- DATE FILTER FIX --------

    const monthNum = Number(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: "Month must be 1–12." });
    }

    if (!classRecord.academic_year.includes("-")) {
      return res.status(500).json({ message: "Invalid academic year." });
    }

    const [start, end] = classRecord.academic_year.split("-");

    const yearStart =
      start.length === 2 ? Number("20" + start) : Number(start);
    const yearEnd =
      end.length === 2 ? Number("20" + end) : Number(end);

    const year = monthNum >= 7 ? yearStart : yearEnd;

    // Local date formatter (NO timezone issue)
    const formatDate = d =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const dateFillter = {
      date: { [Op.between]: [startDateStr, endDateStr] }
    };

    // -------- ATTENDANCE QUERY --------

    const whereClause = {
      student_id,
      class_id,
      subject_id,
      ...dateFillter
    };

    if (role === "Faculty" && faculty_id) {
      whereClause.faculty_id = faculty_id;
    }

    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
      order: [["date", "ASC"], ["lecture_no", "ASC"]]
    });

    // -------- SUMMARY --------

    const totalClasses = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(
      r => r.status === "Present"
    ).length;
    const totalAbsent = attendanceRecords.filter(
      r => r.status === "Absent"
    ).length;

    const attendancePercentage =
      totalClasses > 0
        ? ((totalPresent / totalClasses) * 100).toFixed(2)
        : "0.00";

    const detailedRecords = attendanceRecords.map(r => ({
      attendance_id: r.attendance_id,
      date: r.date,
      day: new Date(r.date).toLocaleDateString("en-US", {
        weekday: "short"
      }),
      lecture_no: r.lecture_no,
      status: r.status,
      faculty_id: r.faculty_id
    }));

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
        faculty_id,
        period: {
          month: `${year}-${String(monthNum).padStart(2, "0")}`,
          from: startDateStr,
          to: endDateStr
        }
      },
      attendance_summary: {
        total_classes: totalClasses,
        total_present: totalPresent,
        total_absent: totalAbsent,
        attendance_percentage: attendancePercentage,
        attendance_rating:
          attendancePercentage >= 75 ? "Good" : "Poor"
      },
      detailed_records: detailedRecords
    };

    return res.status(200).json({
      message: "Attendance report fetched successfully.",
      data: report
    });

  } catch (error) {
    console.error("Error fetching student report:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Class-wise attendance report for all students in a class
export const getClassWiseReport = async (req, res) => {
  try {
    const { class_id, subject_id, month } = req.query;

    const user_id = req.user.uid;
    const role = req.user.role;
    const course_id = req.user.course_id;

    /* ================= VALIDATION ================= */

    if (!class_id || !subject_id) {
      return res.status(400).json({
        message: "class_id and subject_id are required.",
      });
    }

    if (!["Faculty", "Admin"].includes(role)) {
      return res.status(403).json({
        message: "Access denied. Only Faculty and Admin can access this report.",
      });
    }

    /* ================= GET USER INFO ================= */

    let faculty_id = null;
    let admin_id = null;

    const userRecord = await User.findOne({
      where: { user_id },
      attributes: ["username"],
    });

    if (!userRecord) {
      return res.status(404).json({ message: "User not found." });
    }

    if (role === "Faculty") {
      faculty_id = userRecord.username;
    }

    if (role === "Admin") {
      admin_id = userRecord.username;
    }

    /* ================= VERIFY CLASS ================= */

    const classRecord = await Class.findOne({
      where: {
        id: Number(class_id),
        course_id,
      },
    });

    if (!classRecord) {
      return res.status(404).json({ message: "Class not found." });
    }

    /* ================= VERIFY SUBJECT ================= */

    const subjectRecord = await Subject.findOne({
      where: { subject_id, course_id },
    });

    if (!subjectRecord) {
      return res.status(404).json({ message: "Subject not found." });
    }

    /* ================= GET STUDENTS ================= */

    const students = await Student.findAll({
      where: {
        class_pk: classRecord.id,
        course_id,
      },
    });

    if (!students.length) {
      return res.status(404).json({
        message: "No students found in the specified class.",
      });
    }

    const studentIds = students.map((s) => s.student_id);

    /* ================= MONTH FILTER LOGIC ================= */

    let dateFilter = {};
    let period = "ALL AVAILABLE ATTENDANCE";

    if (month) {
      const monthNum = Number(month);

      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          message: "Invalid month. Must be between 1 and 12.",
        });
      }

      // Fix academic year parsing (2025-26 → 2025 & 2026)
      const [startYearStr, endYearShortStr] =
        classRecord.academic_year.split("-");

      const yearStart = Number(startYearStr);

      const yearEnd =
        endYearShortStr.length === 2
          ? Math.floor(yearStart / 100) * 100 + Number(endYearShortStr)
          : Number(endYearShortStr);

      // Academic session: July → June
      const selectedYear = monthNum >= 7 ? yearStart : yearEnd;

      // Proper local date formatting (NO ISO timezone issue)
      const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      const startDate = new Date(selectedYear, monthNum - 1, 1);
      const endDate = new Date(selectedYear, monthNum, 0);

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      dateFilter = {
        date: {
          [Op.between]: [startDateStr, endDateStr],
        },
      };

      period = {
        from: startDateStr,
        to: endDateStr,
      };
    }

    /* ================= BUILD WHERE CLAUSE ================= */

    const whereClause = {
      student_id: { [Op.in]: studentIds },
      class_id: classRecord.id,
      subject_id,
      ...dateFilter,
    };

    if (role === "Faculty" && faculty_id) {
      whereClause.faculty_id = faculty_id;
    }

    /* ================= FETCH ATTENDANCE ================= */

    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
      order: [
        ["student_id", "ASC"],
        ["date", "ASC"],
        ["lecture_no", "ASC"],
      ],
    });

    if (!attendanceRecords.length) {
      return res.status(200).json({
        success: true,
        message: "No attendance records found for selected period.",
        class_info: {
          class_id: classRecord.class_id,
          academic_year: classRecord.academic_year,
        },
        student_reports: [],
      });
    }

    /* ================= GROUP BY STUDENT ================= */

    const attendanceMap = {};

    attendanceRecords.forEach((record) => {
      if (!attendanceMap[record.student_id]) {
        attendanceMap[record.student_id] = [];
      }
      attendanceMap[record.student_id].push(record);
    });

    /* ================= PREPARE STUDENT REPORT ================= */

    const studentReports = students.map((student) => {
      const records = attendanceMap[student.student_id] || [];

      const totalPresent = records.filter(
        (r) => r.status === "Present"
      ).length;

      const totalAbsent = records.filter(
        (r) => r.status === "Absent"
      ).length;

      const totalClasses = records.length;

      const attendancePercentage =
        totalClasses > 0
          ? ((totalPresent / totalClasses) * 100).toFixed(2)
          : "0.00";

      return {
        student_id: student.student_id,
        name: student.name,
        total_attendance: {
          classes_conducted: totalClasses,
          total_present: totalPresent,
          total_absent: totalAbsent,
          attendance_percentage: `${attendancePercentage}%`,
        },
      };
    });

    /* ================= CLASS SUMMARY ================= */

    let totalClasses = 0;
    let totalPresent = 0;
    let totalAbsent = 0;

    studentReports.forEach((report) => {
      totalClasses += report.total_attendance.classes_conducted;
      totalPresent += report.total_attendance.total_present;
      totalAbsent += report.total_attendance.total_absent;
    });

    const classPercentage =
      totalClasses > 0
        ? ((totalPresent / totalClasses) * 100).toFixed(2)
        : "0.00";

    /* ================= FINAL RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Class-wise attendance report generated successfully.",

      class_info: {
        class_id: classRecord.class_id,
        year: classRecord.year,
        section: classRecord.section,
        semester: classRecord.semester,
        academic_year: classRecord.academic_year,
      },

      subject_info: {
        subject_id: subjectRecord.subject_id,
        subject_name: subjectRecord.subject_name,
      },

      report_info: {
        generated_by: role,
        faculty_id,
        admin_id,
        period,
      },

      class_summary: {
        total_students: students.length,
        total_classes_conducted: totalClasses,
        total_present: totalPresent,
        total_absent: totalAbsent,
        class_attendance_percentage: `${classPercentage}%`,
        rating: classPercentage >= 75 ? "Good" : "Poor",
      },

      student_reports: studentReports,
    });
  } catch (error) {
    console.error("Error fetching class-wise report:", error);

    return res.status(500).json({
      message: "Internal server error.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const getClassesForDatewiseReport = async (req, res) => {
  try {
    const course_id = req.user.course_id;
    const semesterType = getSemesterType();
    const semester = semesterType === "odd" ? ["1", "3", "5", "7"] : ["2", "4", "6", "8"];
    const classes = await Class.findAll({
      where: { course_id, semester: { [Op.in]: semester } },
      attributes: ['class_id', 'semester', 'id']
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
    const { class_id, month } = req.query;
    const uid = req.user.uid;
    const role = req.user.role;

    if (!class_id) {
      return res.status(400).json({ message: "class_id is required" });
    }

    /* ================= CLASS WITH MENTOR ================= */

    const classRecord = await Class.findOne({
      where: { id: class_id },
      include: [{
        model: Faculty,
        include: [{
          model: User,
          attributes: ["user_id", "username"]
        }]
      }]
    });

    if (!classRecord) {
      return res.status(404).json({ message: "Class not found" });
    }

    /* ================= FACULTY ACCESS CONTROL ================= */

    if (role === "Faculty") {
      if (
        !classRecord.Faculty ||
        classRecord.Faculty.user_id !== uid
      ) {
        return res.status(403).json({
          message: "Access denied. Only mentor can access this report."
        });
      }
    }

    /* ================= GET STUDENTS ================= */

    const students = await Student.findAll({
      where: { class_pk: classRecord.id },
      order: [["student_id", "ASC"]]
    });

    if (!students.length) {
      return res.status(404).json({
        message: "No students found in class"
      });
    }

    const studentIds = students.map(s => s.student_id);

    /* ================= MONTH FILTER ================= */

    let dateFilter = {};

    if (month) {
      const monthNum = Number(month);

      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          message: "Month must be between 1-12"
        });
      }

      // ✅ Fix academic year parsing (2025-26 → 2025 & 2026)
      const [startStr, endShortStr] =
        classRecord.academic_year.split("-");

      const startYear = Number(startStr);

      const endYear =
        endShortStr.length === 2
          ? Math.floor(startYear / 100) * 100 + Number(endShortStr)
          : Number(endShortStr);

      const selectedYear =
        monthNum >= 7 ? startYear : endYear;

      // ✅ Safe date formatting (NO ISO timezone issue)
      const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      const startDate = new Date(selectedYear, monthNum - 1, 1);
      const endDate = new Date(selectedYear, monthNum, 0);

      dateFilter.date = {
        [Op.between]: [
          formatDate(startDate),
          formatDate(endDate)
        ]
      };
    }

    /* ================= FETCH ATTENDANCE ================= */

    const attendanceRecords = await Attendance.findAll({
      where: {
        class_id: classRecord.id,
        student_id: { [Op.in]: studentIds },
        ...dateFilter
      },
      include: [{
        model: Subject,
        attributes: ["subject_id", "subject_name"]
      }],
      order: [["date", "ASC"], ["student_id", "ASC"]]
    });

    /* ================= PROCESS DATA ================= */

    const studentMap = {};
    const subjectSummary = {};
    const uniqueDates = new Set();

    students.forEach(s => {
      studentMap[s.student_id] = {
        student_id: s.student_id,
        name: s.name,
        total_classes: 0,
        present: 0,
        absent: 0,
        attendance_percentage: "0.00%",
        subject_wise: {}
      };
    });

    attendanceRecords.forEach(r => {
      const student = studentMap[r.student_id];
      if (!student) return;

      const dateStr = r.date; // already YYYY-MM-DD
      uniqueDates.add(dateStr);

      student.total_classes++;

      if (r.status === "Present") {
        student.present++;
      } else {
        student.absent++;
      }

      const subjectId = r.Subject.subject_id;

      if (!student.subject_wise[subjectId]) {
        student.subject_wise[subjectId] = {
          subject_id: subjectId,
          subject_name: r.Subject.subject_name,
          total_classes: 0,
          present: 0,
          absent: 0
        };
      }

      student.subject_wise[subjectId].total_classes++;

      if (r.status === "Present") {
        student.subject_wise[subjectId].present++;
      } else {
        student.subject_wise[subjectId].absent++;
      }

      subjectSummary[subjectId] ??= {
        subject_id: subjectId,
        subject_name: r.Subject.subject_name
      };
    });

    /* ================= CALCULATE PERCENTAGE ================= */

    Object.values(studentMap).forEach(s => {
      if (s.total_classes > 0) {
        s.attendance_percentage =
          ((s.present / s.total_classes) * 100).toFixed(2) + "%";
      }
    });

    const formattedStudents = Object.values(studentMap).map(s => ({
      ...s,
      subject_wise: Object.values(s.subject_wise)
    }));

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      class_info: {
        class_id: classRecord.class_id,
        mentor: classRecord.Faculty?.User?.username || null
      },
      summary: {
        total_students: students.length,
        working_days: uniqueDates.size
      },
      students: formattedStudents,
      subjects: Object.values(subjectSummary)
    });

  } catch (error) {
    console.error("Overall Attendance Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
