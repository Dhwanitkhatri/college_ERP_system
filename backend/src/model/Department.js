import sequelize from "../config/db";
import { DataTypes } from "sequelize";

const Department = sequelize.define("Department",{
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

module.exports=Department;