import express from "express";
import {
    sendNotification,
    getUserNotifications,
    fetchAllUsersForNotification,
    getAllClasses
} from "../controllers/notificationController.js";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send notification
router.post("/send", authMiddleware, sendNotification);

// Get my notifications
router.get("/my", authMiddleware, getUserNotifications);

router.get("/users-for-notification", authMiddleware, adminMiddleware, fetchAllUsersForNotification);

router.get("/classes", authMiddleware, adminMiddleware, getAllClasses);

export default router;
