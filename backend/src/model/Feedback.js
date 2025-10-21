import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Feedback = sequelize.define("Feedback", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    feedback_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    student_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    faculty_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {min: 1,max: 5}
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date_submitted: {
        type: DataTypes.DATE,
        allowNull: false
    }
});
module.exports = Feedback;
