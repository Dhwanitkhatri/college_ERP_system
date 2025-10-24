import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Notification = sequelize.define("Notification", {
    id: {
        primaryKey: true,
        autoIncrement: true,    
        type: DataTypes.INTEGER
    },
    notification_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    read_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});
