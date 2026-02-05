import {sequelize} from "../config/db.js";
import { DataTypes } from "sequelize";
export const Event  = sequelize.define(
    "events",
    {
      event_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      category: {
        type: DataTypes.ENUM("culture", "academic", "sports"),
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      event_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      event_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      attendees_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });