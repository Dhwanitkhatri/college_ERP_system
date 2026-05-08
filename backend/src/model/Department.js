import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";

export const Department = sequelize.define("Department",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    department_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    department_name:{
        type:DataTypes.STRING,
        allowNull:false
    }
}) 

