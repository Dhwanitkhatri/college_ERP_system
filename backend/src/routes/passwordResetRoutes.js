import express from "express";
import {
  sendResetOTP,
  verifyOTPAndResetPassword
} from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/send-otp", sendResetOTP);

router.post("/verify-otp", verifyOTPAndResetPassword);

export default router;
