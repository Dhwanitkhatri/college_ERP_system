import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Attendance = sequelize.define("Attendance", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    attendance_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    student_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Present", "Absent", "Late"),
        allowNull: false
    }
});
module.exports = Attendance;