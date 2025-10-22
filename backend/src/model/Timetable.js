import {sequelize} from '../config/db.js';
import { DataTypes } from "sequelize";

export const Timetable = sequelize.define("Timetable",{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    schedule_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    class_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    subject_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    faculty_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    day_of_week:{
        type:DataTypes.ENUM("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"),
        allowNull:false
    },
    start_time:{
        type:DataTypes.TIME,
        allowNull:false
    },
    end_time:{
        type:DataTypes.TIME,
        allowNull:false     
    }
});
