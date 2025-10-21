import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const StudentPersonalDetails = sequelize.define("StudentPersonalDetails", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    studentPersonal_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },  
    student_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parent_contact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            is: /^(\+91)?\d{10}$/ 
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    emergency_contact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            is: /^(\+91)?\d{10}$/ 
        }
    },
    adharCard_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});
module.exports = StudentPersonalDetails;