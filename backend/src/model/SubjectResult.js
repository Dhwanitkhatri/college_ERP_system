import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const SubjectResult = sequelize.define("SubjectResult", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  subject_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_marks: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  percentage: {
    type: DataTypes.FLOAT
  },
  grade: {
    type: DataTypes.STRING(5)
  },
  grade_point: {
    type: DataTypes.FLOAT
  },
  is_pass: {
    type: DataTypes.BOOLEAN
  },
  is_backlog: {
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'subject_id', 'exam_id']
    }
  ]
});
