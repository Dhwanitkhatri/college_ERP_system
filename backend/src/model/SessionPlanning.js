import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const SessionPlanning = sequelize.define("SessionPlanning", {
    id: {
        primaryKey: true,   
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    plan_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    class_pk: {
    type: DataTypes.INTEGER,
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
    topics: {
        type: DataTypes.TEXT,
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
        type: DataTypes.ENUM("Planned", "Completed", "Pending"),
        allowNull: false
    }
});
