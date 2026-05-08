// src/middleware/featureGuard.js
import {FeatureFlag} from "../model/FeatureFlag.js";

export const featureGuard = (featureKey) => {
  return async (req, res, next) => {
    const feature = await FeatureFlag.findByPk(featureKey);

    if (!feature || !feature.is_active) {
      return res.status(403).json({
        message: "Feature is currently disabled",
      });
    }

    next();
  };
};
