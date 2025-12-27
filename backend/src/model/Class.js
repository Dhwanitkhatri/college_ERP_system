import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Class = sequelize.define(
  "Class",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    class_id: {
      type: DataTypes.STRING,
      allowNull: false
      
    },

    course_id: {
      type: DataTypes.STRING,
      allowNull: false
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 = FY, 2 = SY, 3 = TY"
    },

    section: {
      type: DataTypes.STRING,
      allowNull: false
    },

    academic_year: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "e.g. 2024-25"
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 to 8"
    }
  },
  {
    tableName: "classes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["class_id", "academic_year"]
      }
    ]
  }
);
