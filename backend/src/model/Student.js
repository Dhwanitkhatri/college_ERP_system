import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Student = sequelize.define("Student",{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    student_id:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    user_id:{//this is foreign key from user table
        type:DataTypes.STRING,
        allowNull:true
    },
    course_id:{//this is foreign key from department table
        type:DataTypes.STRING,
        allowNull:false
    },
    class_id:{ //this is foreign key from class table
        type:DataTypes.STRING,
        allowNull:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dob:{
        type:DataTypes.DATE,
        allowNull:false
    },
    gender:{
        type:DataTypes.ENUM("Male","Female","Other"),
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{isEmail:true}
    },
    admission_year:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{min:2000 , max:2040}
    }
});
module.exports=Student;