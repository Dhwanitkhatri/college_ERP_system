import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const StudentMarks = sequelize.define("StudentMarks", {
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
  component_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  marks_obtained: {
    type: DataTypes.FLOAT
  },
  is_absent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
});
