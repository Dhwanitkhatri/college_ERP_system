// models/StudentFee.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { FeeStructure } from "./FeeStructure.js";
import { Student } from "./Student.js";

export const StudentFee = sequelize.define(
  "StudentFee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    student_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    fee_structure_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assigned_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "studentFees",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["student_id", "fee_structure_id"], // UNIQUE constraint
      },
    ],
  }
);


