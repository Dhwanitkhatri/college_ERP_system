import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    sender_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    sender_role: {
      type: DataTypes.ENUM("Admin", "Faculty"),
      allowNull: false
    },

    receiver_id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    receiver_role: {
      type: DataTypes.ENUM("Student", "Faculty", "Admin"),
      allowNull: true
    },

    course_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    class_id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    section: {
      type: DataTypes.STRING(10),
      allowNull: true
    },

    target_type: {
      type: DataTypes.ENUM(
        "INDIVIDUAL",
        "ROLE",
        "CLASS",
        "COURSE"
      ),
      allowNull: false
    }
  },
  {
    tableName: "notifications",

    timestamps: true,          // ✅ enable timestamps
    createdAt: "created_at",   // ✅ map column name
    updatedAt: "updated_at"    // ✅ map column name
  }
);
