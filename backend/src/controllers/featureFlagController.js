// src/controllers/featureFlagController.js
import FeatureFlag from "../models/FeatureFlag.js";

// GET all feature flags (for admin panel)
export const getAllFeatures = async (req, res) => {
  try {
    const features = await FeatureFlag.findAll({
      order: [["feature_key", "ASC"]],
    });
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE feature ON / OFF
export const toggleFeature = async (req, res) => {
  try {
    const { feature_key } = req.params;

    const feature = await FeatureFlag.findByPk(feature_key);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    feature.is_active = !feature.is_active;
    await feature.save();

    res.json({
      feature_key: feature.feature_key,
      is_active: feature.is_active,
      message: "Feature status updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
