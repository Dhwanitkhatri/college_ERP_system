import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Backlog = sequelize.define("Backlog", {
  backlog_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  subject_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  first_failed_exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cleared_exam_id: {
    type: DataTypes.INTEGER
  },
  total_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM('ACTIVE','CLEARED'),
    defaultValue: 'ACTIVE'
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'subject_id']
    }
  ]
});
