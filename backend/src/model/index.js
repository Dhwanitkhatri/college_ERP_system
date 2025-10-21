import { Role } from './Role.js';
import { User } from './user.js';
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
import { EmployeePersonalDetails } from './EmpolyeePersonalDetails.js';
import { Admin } from './Admin.js';
import sequelize from '../config/db.js';

// Initialize all models    
// Define associations here 
Role.hasMany(User, { foreignKey: 'role_id' });//one role can have multiple users
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(Faculty, { foreignKey: 'user_id' });//one user can have multiple faculties
Faculty.belongsTo(User, { foreignKey: 'user_id' });

Department.hasMany(Faculty, { foreignKey: 'department_id' });//one department can have multiple faculties
Faculty.belongsTo(Department, { foreignKey: 'department_id' });

User.hasMany(Student, { foreignKey: 'user_id' });//one user can have multiple students
Student.belongsTo(User, { foreignKey: 'user_id' });

Course.hasMany(Student, { foreignKey: 'course_id' });//one course can have multiple students
Student.belongsTo(Course, { foreignKey: 'course_id' });

Class.hasMany(Student, { foreignKey: 'class_id' });//one class can have multiple students
Student.belongsTo(Class, { foreignKey: 'class_id' });

Department.hasMany(Course, { foreignKey: 'department_id' }); //one department can have multiple courses   
Course.belongsTo(Department, { foreignKey: 'department_id' });

Faculty.hasMany(Subject, { foreignKey: 'faculty_id' }); //one faculty can teach multiple subjects
Subject.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Course.hasMany(Subject, { foreignKey: 'course_id' });//one course can have multiple subjects
Subject.belongsTo(Course, { foreignKey: 'course_id' });

Course.hasMany(Class, { foreignKey: 'course_id' });//one course can have multiple classes
Class.belongsTo(Course, { foreignKey: 'course_id' });

Class.hasMany(Timetable, { foreignKey: 'class_id' });//one class can have multiple timetables
Timetable.belongsTo(Class, { foreignKey: 'class_id' });

Subject.hasMany(Timetable, { foreignKey: 'subject_id' });//one subject can have multiple timetables
Timetable.belongsTo(Subject, { foreignKey: 'subject_id' });

Faculty.hasMany(Timetable, { foreignKey: 'faculty_id' });//one faculty can have multiple timetables
Timetable.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Student.hasMany(Attendance, { foreignKey: 'student_id' });//one student can have multiple attendances
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

Subject.hasMany(Attendance, { foreignKey: 'subject_id' });//one subject can have multiple attendances
Attendance.belongsTo(Subject, { foreignKey: 'subject_id' });

Student.hasMany(Result, { foreignKey: 'student_id' });//one student can have multiple results
Result.belongsTo(Student, { foreignKey: 'student_id' });

Subject.hasMany(Result, { foreignKey: 'subject_id' });//one subject can have multiple results
Result.belongsTo(Subject, { foreignKey: 'subject_id' });

Faculty.hasMany(SessionPlanning, { foreignKey: 'faculty_id' });//one faculty can have multiple session plannings
SessionPlanning.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Subject.hasMany(SessionPlanning, { foreignKey: 'subject_id' }); //one subject can have multiple session plannings
SessionPlanning.belongsTo(Subject, { foreignKey: 'subject_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });//one user can have multiple notifications
Notification.belongsTo(User, { foreignKey: 'user_id' });

Student.hasMany(Feedback, { foreignKey: 'student_id' });//one student can have multiple feedbacks
Feedback.belongsTo(Student, { foreignKey: 'student_id' });

Faculty.hasMany(Feedback, { foreignKey: 'faculty_id' });//one faculty can have multiple feedbacks
Feedback.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Student.hasOne(StudentPersonalDetails, { foreignKey: 'student_id' });//one student has one personal detail
StudentPersonalDetails.belongsTo(Student, { foreignKey: 'student_id' });

Faculty.hasOne(EmployeePersonalDetails, { foreignKey: 'faculty_id' });//one faculty has one personal detail
EmployeePersonalDetails.belongsTo(Faculty, { foreignKey: 'faculty_id' });

User.hasOne(Admin, { foreignKey: 'user_id' });//one user has one admin
Admin.belongsTo(User, { foreignKey: 'user_id' });

Department.hasOne(Admin, { foreignKey: 'department_id' });//one department has one admin
Admin.belongsTo(Department, { foreignKey: 'department_id' });

export {
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











