// src/routes/authRoutes.js
import express from "express";
import { login, logout } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {loginLimiter} from "../middleware/rateLimiter.js"

const router = express.Router();

// Public route
router.post("/login", loginLimiter , login);

//logout route
router.post("/logout", authMiddleware, logout);

// Example protected route (for testing middleware)
router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    message: "Token verified successfully",
    user: req.user,
  });
});

export default router;
