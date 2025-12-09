import express from "express";
import {
    createNotification,
    sendGroupNotification,
    getAllNotifications,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    deleteAllNotifications
} from "../controllers/notificationController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create notification for students + faculty
router.post("/create", authMiddleware, adminMiddleware, createNotification);

// Send notification to group (students OR faculty)
router.post("/group", authMiddleware, adminMiddleware, sendGroupNotification);

// Get all notifications (admin only)
router.get("/all", authMiddleware, adminMiddleware, getAllNotifications);

// Get notifications for logged-in user
router.get("/my", authMiddleware, getUserNotifications);

// Mark notification as read
router.patch("/read/:notification_id", authMiddleware, markNotificationAsRead);

// Delete a single notification for logged-in user
router.delete("/delete/:notification_id", authMiddleware, deleteNotification);

// Delete ALL notifications (admin only)
router.delete("/delete-all", authMiddleware, adminMiddleware, deleteAllNotifications);

export default router;
