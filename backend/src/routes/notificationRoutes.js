import express from "express";
import {
    sendNotification,
    getUserNotifications,
    fetchAllUsersForNotification,
    getAllClasses,
    getMySentNotifications,
    deleteNotification,
    updateNotification,
    getNotificationById
} from "../controllers/notificationController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import { featureGuard } from "../middleware/featureFlagMiddleware.js";

const router = express.Router();

// Send notification
router.post("/send", authMiddleware, featureGuard("send_notifications"),sendNotification);

// Get my notifications
router.get("/my", authMiddleware,featureGuard("send_notifications") ,getUserNotifications);

router.get("/users-for-notification", authMiddleware, fetchAllUsersForNotification);

router.get("/classes", authMiddleware, getAllClasses);
router.get("/my-notifications", authMiddleware, getMySentNotifications);
router.put("/:id", authMiddleware, updateNotification);
router.delete("/:id", authMiddleware, deleteNotification);
router.get("/:id", authMiddleware,getNotificationById);


export default router;
