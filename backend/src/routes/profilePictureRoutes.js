// src/routes/profilePictureRoutes.js
import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";
import { profileUpload } from "../middleware/profileUpload.js";
import {
    uploadProfilePicture,
    getProfilePicture,
    deleteProfilePicture,
    profileInfoAdmin,
    changePassword,
    updateMyProfile
} from "../controllers/profilePictureController.js";

const router = express.Router();

// Upload or Update Profile Picture
router.post("/upload", 
    authMiddleware,     
    profileUpload,       
    uploadProfilePicture 
);

// Get Profile Picture
router.get("/get", authMiddleware, getProfilePicture);

// Delete Profile Picture
router.delete("/delete", authMiddleware, deleteProfilePicture);

router.get("/adminInfo",authMiddleware,profileInfoAdmin);

router.put("/change-password",authMiddleware,changePassword);

router.put("/update-my-profile",authMiddleware,updateMyProfile)
export default router;