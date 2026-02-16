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
  component_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM('EXAM', 'ASSIGNMENT', 'ATTENDANCE', 'QUIZ'),
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
