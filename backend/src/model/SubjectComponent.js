import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const SubjectComponent = sequelize.define("SubjectComponent", {
  component_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject_id: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('INTERNAL', 'EXTERNAL', 'ASSIGNMENT', 'ATTENDANCE', 'BACKLOG'),
    allowNull: false
  },

  max_marks: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  min_marks: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true,
});
