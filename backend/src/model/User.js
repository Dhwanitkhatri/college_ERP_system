
import {sequelize} from '../config/db.js';
import { DataTypes } from "sequelize";  

export const User = sequelize.define("User",{
    user_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role_id:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    status:{
        type:DataTypes.ENUM('active' ,'inactive'),
        defaultValue:'active'
    }
})

