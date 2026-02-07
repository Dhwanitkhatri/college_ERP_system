import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const BacklogAttempt = sequelize.define("BacklogAttempt", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  backlog_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attempt_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  result_status: {
    type: DataTypes.ENUM('FAIL','PASS')
  }
}, {
  timestamps: false
});
