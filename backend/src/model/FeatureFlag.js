// src/models/FeatureFlag.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";

export const FeatureFlag = sequelize.define(
  "featureFlag",
  {
    feature_key: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "featureFlags",
    timestamps: true,
  }
);


