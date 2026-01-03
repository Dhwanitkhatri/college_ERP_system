import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const FeeStructure = sequelize.define(
  "FeeStructure",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    course_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    academic_year: {
      type: DataTypes.STRING(9), // e.g. 2024-2025
      allowNull: false,
    },

    tuition_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    exam_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    library_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    lab_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    misc_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    total_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
    {
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["course_id", "semester", "academic_year"],
      },
    ],
  }
);
