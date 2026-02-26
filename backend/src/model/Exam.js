import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Exam = sequelize.define("Exam", {
  exam_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  exam_type: {
    type: DataTypes.ENUM('REGULAR','RE-EXAM','IMPROVEMENT','BACKLOG'),
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
  status: {
    type: DataTypes.ENUM('DRAFT','PUBLISHED'),
    defaultValue: 'DRAFT'
  }
}, {
  timestamps: true
});
