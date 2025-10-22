import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Result = sequelize.define("Result", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    result_id: {
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
    marks: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    max_marks: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
