// src/controllers/featureFlagController.js
import {FeatureFlag} from "../model/FeatureFlag.js";

// GET all feature flags (for admin panel)
export const getAllFeatures = async (req, res) => {
  try {
    console.log("hello")
    const features = await FeatureFlag.findAll();
    console.log(features);
    res.json(features);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE feature ON / OFF
export const toggleFeature = async (req, res) => {
  try {
    const { feature_key } = req.params;

    const feature = await FeatureFlag.findOne({
      where: { feature_key },
    });

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    // ✅ Proper boolean toggle
    feature.is_active = !feature.is_active;

    await feature.save();

    res.json({
      feature_key: feature.feature_key,
      is_active: feature.is_active, // true / false
      message: "Feature status updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
