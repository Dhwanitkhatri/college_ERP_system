import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const EmployeePersonalDetails = sequelize.define("EmployeePersonalDetails", {
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
        }
    },
    alternate_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate:{isEmail:true}
    }
});
module.exports = EmployeePersonalDetails;