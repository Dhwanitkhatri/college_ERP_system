// models/FeePayment.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { FeeStructure } from "./FeeStructure.js";

export const FeePayment = sequelize.define(
  "FeePayment",
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

    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    payment_mode: {
      type: DataTypes.ENUM("CASH", "CHEQUE"),
      allowNull: false,
    },

    reference_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    received_by: {
      type: DataTypes.STRING(20),
      allowNull: false, // admin user id
    },

    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "feePayments",
    timestamps: true,      // createdAt & updatedAt
  }
);

// Associations
FeePayment.belongsTo(FeeStructure, {
  foreignKey: "fee_structure_id",
  as: "feeStructure",
});
