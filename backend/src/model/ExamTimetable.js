import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const ExamTimetable = sequelize.define("ExamTimetable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject_id: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  exam_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME
  },
  end_time: {
    type: DataTypes.TIME
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["exam_id", "subject_id"]
    }
  ]
});
