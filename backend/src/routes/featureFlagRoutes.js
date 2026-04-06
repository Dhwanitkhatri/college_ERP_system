// src/routes/featureFlagRoutes.js
import express from "express";
import {
  getAllFeatures,
  toggleFeature,
} from "../controllers/featureFlagController.js";

import { authMiddleware , adminMiddleware} from "../middleware/authMiddleware.js";


const router = express.Router();

// Admin: fetch all feature flags
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllFeatures
);

// Admin: toggle feature
router.put(
  "/toggle/:feature_key",
  authMiddleware,
  adminMiddleware,
  toggleFeature
);

export default router;
