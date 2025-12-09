import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Faculty = sequelize.define("Faculty",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    faculty_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    user_id:{
        type:DataTypes.INTEGER,
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
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            is: /^(\+91)?\d{10}$/ 
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
}

})
