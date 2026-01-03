// src/routes/featureFlagRoutes.js
import express from "express";
import {
  getAllFeatures,
  toggleFeature,
} from "../controllers/featureFlagController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Admin: fetch all feature flags
router.get(
  "/",
  authMiddleware,
  isAdmin,
  getAllFeatures
);

// Admin: toggle feature
router.patch(
  "/toggle/:feature_key",
  authMiddleware,
  isAdmin,
  toggleFeature
);

export default router;
