import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Course = sequelize.define("Course",{
    id:{
        primaryKey:true,
        type:DataTypes.INTEGER,
        autoIncrement:true
    },
    course_id:{
        unique:true,
        type:DataTypes.STRING,
        allowNull:false
    },
    department_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    course_name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    duration:{
        type:DataTypes.ENUM("2","3","4","5"),
        allowNull:false
    }
});
