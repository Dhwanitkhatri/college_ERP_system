// Import Sequelize instance
import { sequelize } from '../config/db.js';

// Import all models
import { Role } from './Role.js';
import { User } from './User.js';
import { Department } from './Department.js';
import { Faculty } from './Faculty.js';
import { Student } from './Student.js';
import { Course } from './Course.js';
import { Subject } from './Subject.js';
import { Class } from './Class.js';
import { Timetable } from './Timetable.js';
import { Attendance } from './Attendance.js';
import { Result } from './Result.js';
import { SessionPlanning } from './SessionPlanning.js';
import { Notification } from './Notification.js';
import { Feedback } from './Feedback.js';
import { StudentPersonalDetails } from './StudentPersonalDetails.js';
import { EmployeePersonalDetails } from './EmployeePersonalDetails.js';
import { Admin } from './Admin.js';
import { FeatureFlag } from './FeatureFlag.js';
import { FeeStructure } from './FeeStructure.js';
import { StudentFee } from './StudentFees.js';
import { FeePayment } from './FeePayment.js';
import {Event} from './Event.js';
import { Exam } from './Exam.js';
import { Backlog } from './Backlog.js';
import { BacklogAttempt } from './BacklogAttempts.js';
import { SemesterResult } from './SemesterResult.js';
import { StudentMarks } from './StudentMarks.js';
import { SubjectComponent } from './SubjectComponent.js';
import { SubjectResult } from './SubjectResult.js';
import { LearningMaterial } from './LearningMaterial.js';

import { ExamTimetable } from './ExamTimetable.js';

/* =====================================================
   BASIC RELATIONSHIPS
===================================================== */

// Role ↔ User
Role.hasMany(User, { foreignKey: 'role_id', sourceKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id', targetKey: 'role_id' });

// User ↔ Faculty
User.hasMany(Faculty, { foreignKey: 'user_id', sourceKey: 'user_id' });
Faculty.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });

// User ↔ Student
User.hasMany(Student, { foreignKey: 'user_id', sourceKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });

// Department ↔ Course
Department.hasMany(Course, { foreignKey: 'department_id', sourceKey: 'department_id' });
Course.belongsTo(Department, { foreignKey: 'department_id', targetKey: 'department_id' });

// Course ↔ Student
Course.hasMany(Student, { foreignKey: 'course_id', sourceKey: 'course_id' });
Student.belongsTo(Course, { foreignKey: 'course_id', targetKey: 'course_id' });
// Faculty ↔ Subject
//Faculty.hasMany(Subject, { foreignKey: 'faculty_id' ,sourceKey:'faculty_id'});
//Subject.belongsTo(Faculty, { foreignKey: 'faculty_id',targetKey:'faculty_id' });


// Course ↔ Subject
Course.hasMany(Subject, { foreignKey: 'course_id', sourceKey: 'course_id' });
Subject.belongsTo(Course, { foreignKey: 'course_id', targetKey: 'course_id' });

// Faculty ↔ Subject
//Faculty.hasMany(Subject, { foreignKey: 'faculty_id', sourceKey: 'faculty_id' });
//Subject.belongsTo(Faculty, { foreignKey: 'faculty_id', targetKey: 'faculty_id' });

// Course ↔ Class
Course.hasMany(Class, { foreignKey: 'course_id', sourceKey: 'course_id' });
Class.belongsTo(Course, { foreignKey: 'course_id', targetKey: 'course_id' });

//events belong to course
Course.hasMany(Event, {
  foreignKey: "course_id",
  sourceKey: "course_id",
});

Event.belongsTo(Course, {
  foreignKey: "course_id",
  targetKey: "course_id",
});

/* =====================================================
   CLASS RELATIONSHIPS
===================================================== */

// Class ↔ Faculty (Mentor)
Class.belongsTo(Faculty, {
  foreignKey: "mentor_id",
  targetKey: "faculty_id"
});
Faculty.hasMany(Class, {
  foreignKey: "mentor_id",
  sourceKey: "faculty_id"
});

/* =====================================================
   STUDENT RELATED
===================================================== */

// Student ↔ Attendance
Student.hasMany(Attendance, {
  foreignKey: 'student_id',
  sourceKey: 'student_id'
});
Attendance.belongsTo(Student, {
  foreignKey: 'student_id',
  targetKey: 'student_id'
});

// Student ↔ Result
Student.hasMany(Result, {
  foreignKey: 'student_id',
  sourceKey: 'student_id'
});
Result.belongsTo(Student, {
  foreignKey: 'student_id',
  targetKey: 'student_id'
});

// Student ↔ Feedback
Student.hasMany(Feedback, {
  foreignKey: 'student_id',
  sourceKey: 'student_id'
});
Feedback.belongsTo(Student, {
  foreignKey: 'student_id',
  targetKey: 'student_id'
});

// Student ↔ Personal Details
Student.hasOne(StudentPersonalDetails, {
  foreignKey: 'student_id',
  sourceKey: 'student_id'
});
StudentPersonalDetails.belongsTo(Student, {
  foreignKey: 'student_id',
  targetKey: 'student_id'
});

/* =====================================================
   ATTENDANCE MODULE
===================================================== */

// Attendance ↔ Subject
Attendance.belongsTo(Subject, {
  foreignKey: "subject_id",
  targetKey: "subject_id"   // ✅ correct
});

Subject.hasMany(Attendance, {
  foreignKey: "subject_id",
  sourceKey: "subject_id"   // ✅ correct
});

// Timetable ↔ Subject
Subject.hasMany(Timetable, {
  foreignKey: "subject_id",
  sourceKey: "subject_id"
});

Timetable.belongsTo(Subject, {
  foreignKey: "subject_id",
  targetKey: "subject_id"
});




// Attendance ↔ Faculty (who marked attendance)
Attendance.belongsTo(Faculty, {
  foreignKey: "faculty_id",
  targetKey: "faculty_id"
});
Faculty.hasMany(Attendance, {
  foreignKey: "faculty_id",
  sourceKey: "faculty_id"
});

/* =====================================================
   FEE MODULE
===================================================== */

// Student ↔ StudentFee
Student.hasMany(StudentFee, {
  foreignKey: "student_id",
  sourceKey: "student_id"
});
StudentFee.belongsTo(Student, {
  foreignKey: "student_id",
  targetKey: "student_id"
});

// FeeStructure ↔ StudentFee
FeeStructure.hasMany(StudentFee, {
  foreignKey: "fee_structure_id",
  sourceKey: "id"
});
StudentFee.belongsTo(FeeStructure, {
  foreignKey: "fee_structure_id",
  targetKey: "id"
});

// Student ↔ FeePayment
Student.hasMany(FeePayment, {
  foreignKey: "student_id",
  sourceKey: "student_id"
});
FeePayment.belongsTo(Student, {
  foreignKey: "student_id",
  targetKey: "student_id"
});

// FeeStructure ↔ FeePayment
FeeStructure.hasMany(FeePayment, {
  foreignKey: "fee_structure_id",
  sourceKey: "id"
});
FeePayment.belongsTo(FeeStructure, {
  foreignKey: "fee_structure_id",
  targetKey: "id"
});
Student.belongsTo(Class, {
  foreignKey: 'class_pk'
});
Class.hasMany(Student, {
  foreignKey: 'class_pk'
});

//timetable -> class
Class.hasMany(Timetable, {
  foreignKey: "class_pk",
  sourceKey: "id"
});

Timetable.belongsTo(Class, {
  foreignKey: "class_pk",
  targetKey: "id"
});

/* =====================================================
   EXAM MODULE
===================================================== */

StudentMarks.belongsTo(Exam, { foreignKey: 'exam_id' });
StudentMarks.belongsTo(SubjectComponent, { foreignKey: 'component_id' });

SubjectResult.belongsTo(Exam, { foreignKey: 'exam_id' });

SemesterResult.belongsTo(Exam, { foreignKey: 'exam_id' });

Backlog.belongsTo(Exam, { foreignKey: 'first_failed_exam_id' });
Backlog.belongsTo(Exam, { foreignKey: 'cleared_exam_id' });

BacklogAttempt.belongsTo(Backlog, { foreignKey: 'backlog_id' });
BacklogAttempt.belongsTo(Exam, { foreignKey: 'exam_id' });

// Timetable → Faculty
Timetable.belongsTo(Faculty, {
  foreignKey: "faculty_id",
  targetKey: "faculty_id"
});

// Timetable → Subject
Timetable.belongsTo(Subject, {
  foreignKey: "subject_id",
  targetKey: "subject_id"
});

// LearningMaterial ↔ Subject
LearningMaterial.belongsTo(Subject, { foreignKey: 'subject_id', targetKey: 'subject_id' });
Subject.hasMany(LearningMaterial, { foreignKey: 'subject_id', sourceKey: 'subject_id' });

// LearningMaterial ↔ Faculty
LearningMaterial.belongsTo(Faculty, { foreignKey: 'faculty_id', targetKey: 'faculty_id' });
Faculty.hasMany(LearningMaterial, { foreignKey: 'faculty_id', sourceKey: 'faculty_id' });

// LearningMaterial ↔ Class
LearningMaterial.belongsTo(Class, { foreignKey: 'class_pk', targetKey: 'id' });
Class.hasMany(LearningMaterial, { foreignKey: 'class_pk', sourceKey: 'id' });

// LearningMaterial ↔ Course
LearningMaterial.belongsTo(Course, { foreignKey: 'course_id', targetKey: 'course_id' });
Course.hasMany(LearningMaterial, { foreignKey: 'course_id', sourceKey: 'course_id' });



Exam.hasMany(ExamTimetable, {
  foreignKey: "exam_id"
});

ExamTimetable.belongsTo(Exam, {
  foreignKey: "exam_id"
});


ExamTimetable.belongsTo(Subject, {
  foreignKey: "subject_id",
  targetKey: "subject_id"
});

Subject.hasMany(ExamTimetable, {
  foreignKey: "subject_id",
  sourceKey: "subject_id"
});

// SubjectResult ↔ Subject
SubjectResult.belongsTo(Subject, { foreignKey: 'subject_id', targetKey: 'subject_id' });
Subject.hasMany(SubjectResult, { foreignKey: 'subject_id', sourceKey: 'subject_id' });

//subject to class
SessionPlanning.belongsTo(Subject, {
    foreignKey: "subject_id",   // IMPORTANT
    
});

SessionPlanning.belongsTo(Class, {
    foreignKey: "class_pk",     // OR "class_id" if that's your column
     
});

Student.hasMany(StudentMarks, {
  foreignKey: "student_id",
  sourceKey: "student_id"
});

Student.hasMany(SubjectResult, {
  foreignKey: "student_id",
  sourceKey: "student_id"
});



Admin.belongsTo(Course, {
  foreignKey: "course_id"
});

Course.hasMany(Admin, {
  foreignKey: "course_id"
});

Faculty.belongsTo(Course, {
  foreignKey: "course_id"
});

Course.hasMany(Faculty, {
  foreignKey: "course_id"
});
/* =====================================================
   EXPORT
===================================================== */

export {
  sequelize,
  Role,
  User,
  Department,
  Faculty,
  Student,
  Course,
  Subject,
  Class,
  Timetable,
  Attendance,
  Result,
  SessionPlanning,
  Notification,
  Feedback,
  StudentPersonalDetails,
  EmployeePersonalDetails,
  Admin,
  FeatureFlag,
  FeeStructure,
  StudentFee,
  FeePayment,
  Exam,
  Backlog,
  BacklogAttempt,
  SemesterResult,
  StudentMarks,
  SubjectComponent,
  SubjectResult,
};
