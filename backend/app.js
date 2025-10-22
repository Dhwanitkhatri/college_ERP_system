//om ganeshshaya namah
import express from 'express';
import cors from 'cors';
//import "./src/model/index.js"
import {sequelize} from './src/config/db.js';
import dotenv from 'dotenv';
import { Admin } from './src/model/Admin.js';
import { Attendance } from './src/model/Attendance.js';
import { Class } from './src/model/Class.js';
import { Course } from './src/model/Course.js';
import { Department } from './src/model/Department.js';
import { EmployeePersonalDetails } from './src/model/EmployeePersonalDetails.js';
import { Faculty } from './src/model/Faculty.js';
import { Feedback } from './src/model/Feedback.js';
import { Notification } from './src/model/Notification.js';
import  { Result } from './src/model/Result.js';
import { Role } from './src/model/Role.js';
import { SessionPlanning } from './src/model/SessionPlanning.js';
import { Student } from './src/model/Student.js';
import { StudentPersonalDetails } from './src/model/StudentPersonalDetails.js';
import { Subject } from './src/model/Subject.js';
import { Timetable } from './src/model/Timetable.js';
import { User } from './src/model/User.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;


// Test DB connection
try {
  await sequelize.authenticate();
  console.log('Database connected successfully!');

  await sequelize.sync({alter:true});
  console.log('tables created successfully ');
} catch (error) {
  console.error('Database connection failed:', error);
} 
app.get('/', (req, res) => {
  res.send('College ERP System Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

