import { date } from "zod";
import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const EmployeePersonalDetails = sequelize.define("EmployeePersonalDetails", {
    id: {
        primaryKey: true,
        autoIncrement: true,    
        type: DataTypes.INTEGER
    },
    employeePersonal_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adherCard_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    emergency_contact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            is: /^(\+91)?\d{10}$/ 
        },
    },
    DOB:{
        type :DataTypes.DATE
    },
    
    alternate_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate:{isEmail:true}
    }
});
