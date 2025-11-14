import {sequelize} from '../config/db.js';
import { DataTypes } from "sequelize";

export const Subject = sequelize.define("Subject",{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:DataTypes.INTEGER
    },
    subject_id:{
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
    },
    semester:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            min:1 ,max:6
        }
    },
    lecture_per_week:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            min:1 ,max:6
        }
    }
});

