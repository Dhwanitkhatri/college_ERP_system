import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Faculty = sequelize.define("Faculty",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true
    },
    faculty_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    user_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    course_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            is: /^(\+91)?\d{10}$/ 
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    }

})
module.exports=Faculty;