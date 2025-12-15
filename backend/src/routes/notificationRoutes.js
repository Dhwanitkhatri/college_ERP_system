import express from "express";
import {
    createNotification,
    sendGroupNotification,
    sendClassYearNotification,
    sendSingleUserNotification,
    getAllNotifications,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchAllUsersForNotification,
    getAllClasses
} from "../controllers/notificationController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create notification for students + faculty
router.post("/create", authMiddleware, adminMiddleware, createNotification);

// Send notification to group (students OR faculty)
router.post("/group", authMiddleware, adminMiddleware, sendGroupNotification);

// Send notification to class and year
router.post("/class-year", authMiddleware, adminMiddleware, sendClassYearNotification);

// Send notification to single user
router.post("/single", authMiddleware, adminMiddleware, sendSingleUserNotification);

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

router.get("/users-for-notification", authMiddleware, adminMiddleware, fetchAllUsersForNotification);

router.get("/classes", authMiddleware, adminMiddleware, getAllClasses);

export default router;
