import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Class = sequelize.define("Class",{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.INTEGER
    },
    class_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    course_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    year:{
        type:DataTypes.INTEGER,
        validate:{min:2000 , max:2050},
        allowNull:false
    },
    section:{
        type:DataTypes.STRING,
        allowNull:false
    }
});
