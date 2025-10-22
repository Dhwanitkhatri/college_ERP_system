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
import { EmployeePersonalDetails } from './EmployeePersonalDetails.js'; // fixed typo
import { Admin } from './Admin.js';

/* -------------------------------------------------
   INITIALIZE ALL MODELS
   (assumes models are defined via sequelize.define)
--------------------------------------------------*/



// If you are using `sequelize.define` in each model file, this is enough
// If your models are classes, call initModel(sequelize) on each

/* -------------------------------------------------
   DEFINE RELATIONSHIPS
--------------------------------------------------*/

// Role ↔ User
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// User ↔ Faculty
User.hasMany(Faculty, { foreignKey: 'user_id' });
Faculty.belongsTo(User, { foreignKey: 'user_id' });

// Department ↔ Faculty
Department.hasMany(Faculty, { foreignKey: 'department_id' });
Faculty.belongsTo(Department, { foreignKey: 'department_id' });

// User ↔ Student
User.hasMany(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

// Course ↔ Student
Course.hasMany(Student, { foreignKey: 'course_id' });
Student.belongsTo(Course, { foreignKey: 'course_id' });

// Class ↔ Student
Class.hasMany(Student, { foreignKey: 'class_id' });
Student.belongsTo(Class, { foreignKey: 'class_id' });

// Department ↔ Course
Department.hasMany(Course, { foreignKey: 'department_id' });
Course.belongsTo(Department, { foreignKey: 'department_id' });

// Faculty ↔ Subject
Faculty.hasMany(Subject, { foreignKey: 'faculty_id' });
Subject.belongsTo(Faculty, { foreignKey: 'faculty_id' });

// Course ↔ Subject
Course.hasMany(Subject, { foreignKey: 'course_id' });
Subject.belongsTo(Course, { foreignKey: 'course_id' });

// Course ↔ Class
Course.hasMany(Class, { foreignKey: 'course_id' });
Class.belongsTo(Course, { foreignKey: 'course_id' });

// Class ↔ Timetable
Class.hasMany(Timetable, { foreignKey: 'class_id' });
Timetable.belongsTo(Class, { foreignKey: 'class_id' });

// Subject ↔ Timetable
Subject.hasMany(Timetable, { foreignKey: 'subject_id' });
Timetable.belongsTo(Subject, { foreignKey: 'subject_id' });

// Faculty ↔ Timetable
Faculty.hasMany(Timetable, { foreignKey: 'faculty_id' });
Timetable.belongsTo(Faculty, { foreignKey: 'faculty_id' });

// Student ↔ Attendance
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

// Subject ↔ Attendance
Subject.hasMany(Attendance, { foreignKey: 'subject_id' });
Attendance.belongsTo(Subject, { foreignKey: 'subject_id' });

// Student ↔ Result
Student.hasMany(Result, { foreignKey: 'student_id' });
Result.belongsTo(Student, { foreignKey: 'student_id' });

// Subject ↔ Result
Subject.hasMany(Result, { foreignKey: 'subject_id' });
Result.belongsTo(Subject, { foreignKey: 'subject_id' });

// Faculty ↔ SessionPlanning
Faculty.hasMany(SessionPlanning, { foreignKey: 'faculty_id' });
SessionPlanning.belongsTo(Faculty, { foreignKey: 'faculty_id' });

// Subject ↔ SessionPlanning
Subject.hasMany(SessionPlanning, { foreignKey: 'subject_id' });
SessionPlanning.belongsTo(Subject, { foreignKey: 'subject_id' });

// User ↔ Notification
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Student ↔ Feedback
Student.hasMany(Feedback, { foreignKey: 'student_id' });
Feedback.belongsTo(Student, { foreignKey: 'student_id' });

// Faculty ↔ Feedback
Faculty.hasMany(Feedback, { foreignKey: 'faculty_id' });
Feedback.belongsTo(Faculty, { foreignKey: 'faculty_id' });

// Student ↔ StudentPersonalDetails
Student.hasOne(StudentPersonalDetails, { foreignKey: 'student_id' });
StudentPersonalDetails.belongsTo(Student, { foreignKey: 'student_id' });

// Faculty ↔ EmployeePersonalDetails
Faculty.hasOne(EmployeePersonalDetails, { foreignKey: 'faculty_id' });
EmployeePersonalDetails.belongsTo(Faculty, { foreignKey: 'faculty_id' });

// User ↔ Admin
User.hasOne(Admin, { foreignKey: 'user_id' });
Admin.belongsTo(User, { foreignKey: 'user_id' });

// Department ↔ Admin
Department.hasOne(Admin, { foreignKey: 'department_id' });
Admin.belongsTo(Department, { foreignKey: 'department_id' });

/* -------------------------------------------------
   EXPORT MODELS & SEQUELIZE
--------------------------------------------------*/
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
  Admin  
};
