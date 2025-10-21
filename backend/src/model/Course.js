import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Course = sequelize.define("Course",{
    id:{
        primaryKey:true,
        type:DataTypes.STRING
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
        type:DataTypes.ENUM(2,3,4,5),
        allowNull:false
    }
});
module.exports=Course;