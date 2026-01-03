import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const StudentFees = sequelize.define(
  "StudentFees",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    student_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    fee_structure_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "fee_structures",
        key: "id",
      },
    },

    assigned_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Paid", "Unpaid", "Partial"),
      allowNull: false,
      defaultValue: "Unpaid",
    },
  },
  {
    timestamps: true,
  }
);
