import express from "express";
import {
    sendNotification,
    getUserNotifications,
    fetchAllUsersForNotification,
    getAllClasses
} from "../controllers/notificationController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import { featureGuard } from "../middleware/featureFlagMiddleware.js";

const router = express.Router();

// Send notification
router.post("/send", authMiddleware, featureGuard("NOTIFICATION_SEND"),sendNotification);

// Get my notifications
router.get("/my", authMiddleware,featureGuard("NOTIFICATION_VIEW") ,getUserNotifications);

router.get("/users-for-notification", authMiddleware, adminMiddleware, fetchAllUsersForNotification);

router.get("/classes", authMiddleware, adminMiddleware, getAllClasses);

export default router;
