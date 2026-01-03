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
import { FeatureFlag } from './FeatureFlag.js';

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
Role.hasMany(User, { foreignKey: 'role_id' ,sourceKey:'role_id'});
User.belongsTo(Role, { foreignKey: 'role_id',targetKey:'role_id' });

// User ↔ Faculty
User.hasMany(Faculty, { foreignKey: 'user_id' , sourceKey:'user_id' });
Faculty.belongsTo(User, { foreignKey: 'user_id' ,targetKey:'user_id'});


// User ↔ Student
User.hasMany(Student, { foreignKey: 'user_id' ,sourceKey:'user_id'});
Student.belongsTo(User, { foreignKey: 'user_id',targetKey:'user_id' });

// Course ↔ Student
Course.hasMany(Student, { foreignKey: 'course_id' ,sourceKey:'course_id'});
Student.belongsTo(Course, { foreignKey: 'course_id',targetKey:'course_id' });

Class.hasMany(Student, {
  foreignKey: "class_pk",
 
});

Student.belongsTo(Class, {
  foreignKey: "class_pk",
});

// Department ↔ Course
Department.hasMany(Course, { foreignKey: 'department_id',sourceKey:'department_id' });
Course.belongsTo(Department, { foreignKey: 'department_id',targetKey:'department_id' });

// Faculty ↔ Subject
Faculty.hasMany(Subject, { foreignKey: 'faculty_id' ,sourceKey:'faculty_id'});
Subject.belongsTo(Faculty, { foreignKey: 'faculty_id',targetKey:'faculty_id' });

// Course ↔ Subject
Course.hasMany(Subject, { foreignKey: 'course_id' ,sourceKey:'course_id'});
Subject.belongsTo(Course, { foreignKey: 'course_id',targetKey:'course_id' });

// Course ↔ Class
Course.hasMany(Class, { foreignKey: 'course_id',sourceKey:'course_id' });
Class.belongsTo(Course, { foreignKey: 'course_id',targetKey:'course_id' });

// Class ↔ Timetable
Class.hasMany(Timetable, { 
  foreignKey: 'class_pk',  // column in Timetable table
  sourceKey: 'id',         // primary key in Class table
  as: 'timetables'         // optional alias
});

// Timetable → Class
Timetable.belongsTo(Class, { 
  foreignKey: 'class_pk',  // column in Timetable table
  targetKey: 'id',         // primary key in Class table
  as: 'class'              // optional alias
});


// Subject ↔ Timetable
Subject.hasMany(Timetable, { foreignKey: 'subject_id' , sourceKey:'subject_id'});
Timetable.belongsTo(Subject, { foreignKey: 'subject_id' , targetKey:'subject_id'});

// Faculty ↔ Timetable 
Faculty.hasMany(Timetable, { foreignKey: 'faculty_id' , sourceKey:'faculty_id' });
Timetable.belongsTo(Faculty, { foreignKey: 'faculty_id', targetKey:'faculty_id' });

// Student ↔ Attendance
Student.hasMany(Attendance, { foreignKey: 'student_id' , sourceKey:'student_id'});
Attendance.belongsTo(Student, { foreignKey: 'student_id',targetKey:'student_id' });

// Subject ↔ Attendance
Subject.hasMany(Attendance, { foreignKey: 'subject_id',sourceKey:'subject_id' });
Attendance.belongsTo(Subject, { foreignKey: 'subject_id',targetKey:'subject_id' });

// Student ↔ Result
Student.hasMany(Result, { foreignKey: 'student_id', sourceKey:'student_id' });
Result.belongsTo(Student, { foreignKey: 'student_id' , targetKey:'student_id'});

// Subject ↔ Result
Subject.hasMany(Result, { foreignKey: 'subject_id', sourceKey:'subject_id', });
Result.belongsTo(Subject, { foreignKey: 'subject_id' ,targetKey:'subject_id'});

// Faculty ↔ SessionPlanning
Faculty.hasMany(SessionPlanning, { foreignKey: 'faculty_id',sourceKey:'faculty_id' });
SessionPlanning.belongsTo(Faculty, { foreignKey: 'faculty_id' ,targetKey:'faculty_id'});

// Subject ↔ SessionPlanning
Subject.hasMany(SessionPlanning, { foreignKey: 'subject_id' , sourceKey:'subject_id' });
SessionPlanning.belongsTo(Subject, { foreignKey: 'subject_id', targetKey:'subject_id' });



// Student ↔ Feedback
Student.hasMany(Feedback, { foreignKey: 'student_id', sourceKey:'student_id' });
Feedback.belongsTo(Student, { foreignKey: 'student_id', targetKey:'student_id' });

// Faculty ↔ Feedback
Faculty.hasMany(Feedback, { foreignKey: 'faculty_id' , sourceKey:'faculty_id'});
Feedback.belongsTo(Faculty, { foreignKey: 'faculty_id' ,targetKey:'faculty_id'});

// Student ↔ StudentPersonalDetails
Student.hasOne(StudentPersonalDetails, { foreignKey: 'student_id', sourceKey:'student_id' });
StudentPersonalDetails.belongsTo(Student, { foreignKey: 'student_id',targetKey:'student_id' });

// Faculty ↔ EmployeePersonalDetails
Faculty.hasOne(EmployeePersonalDetails, { foreignKey: 'faculty_id' , sourceKey:'faculty_id' });
EmployeePersonalDetails.belongsTo(Faculty, { foreignKey: 'faculty_id' , targetKey:'faculty_id'});

// User ↔ Admin
User.hasOne(Admin, { foreignKey: 'user_id' , sourceKey:'user_id'});
Admin.belongsTo(User, { foreignKey: 'user_id' , targetKey:'user_id'});

// Department ↔ Admin
Course.hasOne(Admin, { foreignKey: 'course_id' , sourceKey:'course_id'});
Admin.belongsTo(Course, { foreignKey: 'course_id' , targetKey:'course_id' });

/* One Department → Many Students */
Department.hasMany(Student, {
  foreignKey: "department_id",
  sourceKey: "department_id"
});

/* Each Student → One Department */
Student.belongsTo(Department, {
  foreignKey: "department_id",
  targetKey: "department_id"
});



Class.belongsTo(User, {
  foreignKey: "mentor_id",
  targetKey: "username",
  as: "mentor"
});
Attendance.belongsTo(User, {
  foreignKey: "faculty_id",
  targetKey: "username",
  as: "Faculty"
});

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
  Admin,
  FeatureFlag  
};
