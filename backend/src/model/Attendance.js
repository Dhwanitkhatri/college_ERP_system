import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Attendance = sequelize.define("Attendance", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  faculty_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  class_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lecture_no: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("Present", "Absent", "Late"),
    allowNull: false
  }
});

