// src/controllers/profilePictureController.js
import path from 'path';
import fs from 'fs';

// Import your models
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Admin } from "../model/Admin.js";
import {EmployeePersonalDetails} from '../model/EmployeePersonalDetails.js';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const roleModelMap = {
    student: Student,
    faculty: Faculty,
    admin: Admin
};

// Helper to delete old profile picture
const deleteOldFile = (filePath) => {
    if (!filePath) return;
    
    try {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted old file: ${filePath}`);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const userId = req.user.uid;
        const role = req.user.role.toLowerCase();
        const Model = roleModelMap[role];

        if (!Model) {
            // Delete the uploaded file if role is invalid
            if (req.file.path) fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: "Invalid user role"
            });
        }

        // Find user
        const user = await Model.findOne({ where: { user_id: userId } });

        if (!user) {
            // Delete uploaded file if user not found
            if (req.file.path) fs.unlinkSync(req.file.path);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete old profile picture if exists
        if (user.profile_picture) {
            deleteOldFile(user.profile_picture);
        }

        // Build file path (relative to server root)
        const profilePicturePath = `/uploads/profiles/${req.file.filename}`;

        // Update database
        user.profile_picture = profilePicturePath;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            profile_picture: profilePicturePath
        });

    } catch (error) {
        console.error("Error uploading profile picture:", error);
        
        // Clean up uploaded file on error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error("Error cleaning up file:", unlinkError);
            }
        }
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get profile picture
export const getProfilePicture = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const role = req.user.role.toLowerCase();
        const Model = roleModelMap[role];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid user role"
            });
        }

        const user = await Model.findOne({
            where: { user_id: userId },
            attributes: ['profile_picture']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            profile_picture: user.profile_picture || null
        });

    } catch (error) {
        console.error("Error fetching profile picture:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
    try {
        const userId = req.user.uid;
        const role = req.user.role.toLowerCase();
        const Model = roleModelMap[role];

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid user role"
            });
        }

        const user = await Model.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete file from server
        if (user.profile_picture) {
            deleteOldFile(user.profile_picture);
        }

        // Update database
        user.profile_picture = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting profile picture:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const profileInfoAdmin = async(req,res)=>{
   try {
     const user_id = req.user.uid;
    const admin = await sequelize.query(
  `
  SELECT 
    a.user_id,
    a.email,
    a.name,
    a.contact_number,
    a.course_id,
    a.admin_id,
    e.address,
    e.DOB
  FROM Admins a
  LEFT JOIN EmployeePersonalDetails e
    ON a.user_id = e.user_id
  WHERE a.user_id = :user_id
  `,
  {
    replacements: { user_id },
    type: Sequelize.QueryTypes.SELECT,
    plain: true
  }
);

    if(!admin){
        return res.status(404).json({message :'admin details not found'})
    }
    return res.status(200).json({admin:admin});
   } catch (error) {
        console.error("Error fetching admin profile:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
   }
}