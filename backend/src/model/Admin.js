import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Admin = sequelize.define("Admin", {
    id: {
        primaryKey: true,   
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    admin_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    course_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(\+91)?\d{10}$/ 
        }       
    }
});
