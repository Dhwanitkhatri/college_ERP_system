// src/controllers/profilePictureController.js
import path from 'path';
import fs from 'fs';

// Import your models
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Admin } from "../model/Admin.js";
import { User } from '../model/User.js';
import {EmployeePersonalDetails} from '../model/EmployeePersonalDetails.js';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcrypt';

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

export const profileInfoAdmin = async (req, res) => {
  try {
    const { role, uid } = req.user;

    if (!role || !uid) {
      return res.status(400).json({
        success: false,
        message: "Invalid token"
      });
    }

    // ================= STUDENT =================
    if (role === "Student") {
      const student = await Student.findOne({
        where: { user_id: uid },
        include: [
          { model: Course, attributes: ["course_name"] },
          { model: Department, attributes: ["department_name"] },
          { model: Class, attributes: ["class_id", "semester", "academic_year"] }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      const personal = await StudentPersonalDetails.findOne({
        where: { student_id: student.student_id }
      });

      return res.json({
        success: true,
        role: "Student",
        data: {
          profile: {
            student_id: student.student_id,
            name: student.name,
            email: student.email,
            gender: student.gender,
            dob: student.dob
          },
          academic: {
            course: student.Course?.course_name || null,
            department: student.Department?.department_name || null,
            class: student.Class?.class_id || null,
            semester: student.Class?.semester || null,
            academic_year: student.Class?.academic_year || null,
            admission_year: student.admission_year,
            year_of_study: student.year_of_study
          },
          personal: personal
            ? {
                parent_name: personal.parent_name,
                parent_contact: personal.parent_contact,
                address: personal.address,
                emergency_contact: personal.emergency_contact,
                adharCard_number: personal.adharCard_number
              }
            : null
        }
      });
    }

    // ================= ADMIN =================
    if (role === "Admin") {
      const admin = await Admin.findOne({
        where: { user_id: uid },
        include: [
          { model: Course, attributes: ["course_name"] }
        ]
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found"
        });
      }

      const personal = await EmployeePersonalDetails.findOne({
        where: { employeePersonal_id: admin.admin_id }
      });

      return res.json({
        success: true,
        role: "Admin",
        data: {
          profile: {
            admin_id: admin.admin_id,
            name: admin.name,
            email: admin.email,
            contact_number: admin.contact_number
          },
          work: {
            course: admin.Course?.course_name || null
          },
          personal: personal
            ? {
                address: personal.address,
                qualification: personal.qualification,
                experience: personal.experience,
                adherCard_number: personal.adherCard_number,
                emergency_contact: personal.emergency_contact,
                alternate_email: personal.alternate_email,
                dob: personal.DOB
              }
            : null
        }
      });
    }

    // ================= FACULTY =================
    if (role === "Faculty") {
      const faculty = await Faculty.findOne({
        where: { user_id: uid },
        include: [
          { model: Course, attributes: ["course_name"] }
        ]
      });

      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found"
        });
      }

      const personal = await EmployeePersonalDetails.findOne({
        where: { employeePersonal_id: faculty.faculty_id }
      });

      return res.json({
        success: true,
        role: "Faculty",
        data: {
          profile: {
            faculty_id: faculty.faculty_id,
            name: faculty.name,
            email: faculty.email,
            phone: faculty.phone
          },
          work: {
            course: faculty.Course?.course_name || null
          },
          personal: personal
            ? {
                address: personal.address,
                qualification: personal.qualification,
                experience: personal.experience,
                adherCard_number: personal.adherCard_number,
                emergency_contact: personal.emergency_contact,
                alternate_email: personal.alternate_email,
                dob: personal.DOB
              }
            : null
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid role"
    });

  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { uid: user_id } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    
    const user = await User.findOne({
      where: { user_id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

   
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again.",
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export const updateMyProfile = async (req, res) => {
  try {
    const { role, uid } = req.user;
    const { profile, academic, personal } = req.body;

    if (!role || !uid) {
      return res.status(400).json({
        success: false,
        message: "Invalid token"
      });
    }

    // ================= STUDENT =================
    if (role === "Student") {
      const student = await Student.findOne({
        where: { user_id: uid }
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      // 🔹 Update main profile
      await student.update({
        name: profile?.name ?? student.name,
        email: profile?.email ?? student.email,
        gender: profile?.gender ?? student.gender,
        dob: profile?.dob ?? student.dob,
        year_of_study: academic?.year_of_study ?? student.year_of_study
      });

      // 🔹 Update / Create personal details
      let personalData = await StudentPersonalDetails.findOne({
        where: { student_id: student.student_id }
      });

      if (personalData) {
        await personalData.update({
          parent_name: personal?.parent_name ?? personalData.parent_name,
          parent_contact: personal?.parent_contact ?? personalData.parent_contact,
          address: personal?.address ?? personalData.address,
          emergency_contact: personal?.emergency_contact ?? personalData.emergency_contact,
          adharCard_number: personal?.adharCard_number ?? personalData.adharCard_number
        });
      } else {
        personalData = await StudentPersonalDetails.create({
          studentPersonal_id: student.student_id,
          student_id: student.student_id,
          parent_name: personal?.parent_name,
          parent_contact: personal?.parent_contact,
          address: personal?.address,
          emergency_contact: personal?.emergency_contact,
          adharCard_number: personal?.adharCard_number
        });
      }

      return res.json({
        success: true,
        message: "Student profile updated successfully"
      });
    }

    // ================= ADMIN =================
    if (role === "Admin") {
      const admin = await Admin.findOne({
        where: { user_id: uid }
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found"
        });
      }

      // 🔹 Update main
      await admin.update({
        name: profile?.name ?? admin.name,
        email: profile?.email ?? admin.email,
        contact_number: profile?.contact_number ?? admin.contact_number
      });

      // 🔹 Personal
      let personalData = await EmployeePersonalDetails.findOne({
        where: { employeePersonal_id: admin.admin_id }
      });

      if (personalData) {
        await personalData.update({
          address: personal?.address ?? personalData.address,
          qualification: personal?.qualification ?? personalData.qualification,
          experience: personal?.experience ?? personalData.experience,
          adherCard_number: personal?.adherCard_number ?? personalData.adherCard_number,
          emergency_contact: personal?.emergency_contact ?? personalData.emergency_contact,
          alternate_email: personal?.alternate_email ?? personalData.alternate_email,
          DOB: personal?.dob ?? personalData.DOB
        });
      } else {
        personalData = await EmployeePersonalDetails.create({
          employeePersonal_id: admin.admin_id,
          user_id: uid,
          address: personal?.address,
          qualification: personal?.qualification,
          experience: personal?.experience,
          adherCard_number: personal?.adherCard_number,
          emergency_contact: personal?.emergency_contact,
          alternate_email: personal?.alternate_email,
          DOB: personal?.dob
        });
      }

      return res.json({
        success: true,
        message: "Admin profile updated successfully"
      });
    }

    // ================= FACULTY =================
    if (role === "Faculty") {
      const faculty = await Faculty.findOne({
        where: { user_id: uid }
      });

      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found"
        });
      }

      // 🔹 Update main
      await faculty.update({
        name: profile?.name ?? faculty.name,
        email: profile?.email ?? faculty.email,
        phone: profile?.phone ?? faculty.phone
      });

      // 🔹 Personal
      let personalData = await EmployeePersonalDetails.findOne({
        where: { employeePersonal_id: faculty.faculty_id }
      });

      if (personalData) {
        await personalData.update({
          address: personal?.address ?? personalData.address,
          qualification: personal?.qualification ?? personalData.qualification,
          experience: personal?.experience ?? personalData.experience,
          adherCard_number: personal?.adherCard_number ?? personalData.adherCard_number,
          emergency_contact: personal?.emergency_contact ?? personalData.emergency_contact,
          alternate_email: personal?.alternate_email ?? personalData.alternate_email,
          DOB: personal?.dob ?? personalData.DOB
        });
      } else {
        personalData = await EmployeePersonalDetails.create({
          employeePersonal_id: faculty.faculty_id,
          user_id: uid,
          address: personal?.address,
          qualification: personal?.qualification,
          experience: personal?.experience,
          adherCard_number: personal?.adherCard_number,
          emergency_contact: personal?.emergency_contact,
          alternate_email: personal?.alternate_email,
          DOB: personal?.dob
        });
      }

      return res.json({
        success: true,
        message: "Faculty profile updated successfully"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid role"
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};