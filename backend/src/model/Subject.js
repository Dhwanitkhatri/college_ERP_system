import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Subject = sequelize.define("Subject",{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:DataTypes.INTEGER
    },
    Subject_id:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    faculty_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    course_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    subject_name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    credit:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

module.exports=Subject;