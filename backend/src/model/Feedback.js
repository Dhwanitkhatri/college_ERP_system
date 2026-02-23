import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Feedback = sequelize.define("Feedback", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  faculty_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date_submitted: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
  course_id:{
    type:DataTypes.STRING,
    allowNull:false
  }
});
