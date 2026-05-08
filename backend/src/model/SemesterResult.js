// models/SemesterResult.js
import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const SemesterResult = sequelize.define("SemesterResult", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  academic_year: {                         
    type: DataTypes.STRING(20),
    allowNull: false
  },
  total_credits: {
    type: DataTypes.INTEGER
  },
  earned_credits: {
    type: DataTypes.INTEGER
  },
  sgpa: {
    type: DataTypes.FLOAT
  },
  cgpa: {
    type: DataTypes.FLOAT
  },
  result_status: {
    type: DataTypes.ENUM('PASS','FAIL')
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'exam_id']
    }
  ]
});