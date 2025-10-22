import  {sequelize}  from "../config/db.js";
import { DataTypes } from "sequelize";

export const Role = sequelize.define("Role",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    role_id:{
        type:DataTypes.STRING,
        unique:true
    },
    role_name:{
        type:DataTypes.STRING,
        allowNull:false
    }
}
)

