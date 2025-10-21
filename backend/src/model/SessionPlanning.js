import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const SessionPlanning = sequelize.define("SessionPlanning", {
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
    subject_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    faculty_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    week_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    topics: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Planned", "Completed", "Pending"),
        allowNull: false
    }
});
module.exports = SessionPlanning;