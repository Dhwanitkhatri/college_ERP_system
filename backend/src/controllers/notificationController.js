// NOTIFICATION CONTROLLER

import { Notification } from "../model/Notification.js";
import { sequelize } from "../config/db.js";
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Admin } from "../model/Admin.js";
import { Class } from "../model/Class.js";
import { Course } from "../model/Course.js";
import { User } from "../model/User.js";
import { where } from "sequelize";
import { QueryTypes } from "sequelize";

// Send notification
export const sendNotification = async (req, res) => {
  try {
    const { title, message, receiver_id, receiver_role, class_id, section, target_type } = req.body;
    const sender_id = req.user.uid;
    const sender_role = req.user.role;
    const course_id = req.user.course_id;

    //validate rquired fields
    if (!title || !message || !target_type) {
      return res.status(400).json({ message: "Title, message, and target_type are required." });
    }

    const senderUser = await User.findOne({
      where: { user_id: sender_id },
      attributes: ['username']
    });
    if (!senderUser) {
      return res.status(404).json({ message: "Sender user not found." });
    }
    // Use username as sender_id
    const senderUserName = senderUser.username;

    //authorize sender role
    if (!["Admin", "Faculty"].includes(sender_role)) {
      return res.status(403).json({ message: "Only admin and faculty can send notifications." });
    }
    // process based on target_type
    switch (target_type) {
      case "INDIVIDUAL": {
        if (!receiver_id || !receiver_role) {
          return res.status(400).json({ message: "receiver_id and receiver_role are required for INDIVIDUAL target_type." });
        }
        let validReceiver = null;
        switch (receiver_role) {
          case "Student":
            validReceiver = await Student.findOne({ where: { student_id: receiver_id, course_id } });
            break;
          case "Faculty":
            validReceiver = await Faculty.findOne({ where: { faculty_id: receiver_id, course_id } });
            break;
          case "Admin":
            validReceiver = await Admin.findOne({ where: { admin_id: receiver_id } });
            break;
          default:
            return res.status(400).json({ message: "Invalid receiver_role." });
        }
        if (!validReceiver) {
          return res.status(404).json({ message: "Receiver not found." });
        }

        await Notification.create({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id,
          receiver_role,
          course_id,
          class_id: class_id || null,
          section: section || null,
          target_type
        });
        return res.status(201).json({
          message: "Notification sent to individual successfully.",
          data: {
            receiver_id,
            receiver_role
          }
        });
      }
      case "CLASS": {
        if (!class_id) {
          return res.status(400).json({ message: "class_id is required for CLASS target_type." });
        }

        const classExists = await Class.findOne({ where: { class_id, course_id } });
        if (!classExists) {
          return res.status(404).json({ message: "Class not found." });
        }

        const students = await Student.findAll({ where: { class_id, course_id } });

        const notifications = students.map(student => ({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id: student.student_id, // Academic ID
          receiver_role: "Student",
          course_id,
          class_id,
          section: classExists.section,
          target_type
        }));
        await Notification.bulkCreate(notifications);
        return res.status(201).json({
          success: true,
          message: `Notification sent to ${students.length} students in class ${class_id}`,
          count: students.length
        });

      }
      case "ROLE": {
        if (!receiver_role) {
          return res.status(400).json({ message: "receiver_role is required for ROLE target_type." });
        }
        let recipients = [];
        let totalCount = 0;

        if (receiver_role === "Student") {
          const students = await Student.findAll({ where: { course_id } });
          recipients = students.map(student => ({
            receiver_id: student.student_id, // Academic ID
            receiver_role: "S"
          }));
          totalCount = students.length;
        }
        else if (receiver_role === "Faculty") {
          const faculties = await Faculty.findAll({ where: { course_id } });
          recipients = faculties.map(faculty => ({
            receiver_id: faculty.faculty_id, // Should be academic ID
            receiver_role: "Faculty"
          }));
          totalCount = faculties.length;
        }
        else if (receiver_role === "Admin") {
          const admins = await Admin.findAll();
          recipients = admins.map(admin => ({
            receiver_id: admin.admin_id, // Should be academic ID
            receiver_role: "Admin"
          }));
          totalCount = admins.length;
        }

        if (totalCount === 0) {
          return res.status(404).json({
            success: false,
            message: `No ${receiver_role}s found`
          });
        }

        const notifications = recipients.map(recipient => ({
          title,
          message,
          sender_id: senderUserName, // Use academic ID
          sender_role: sender_role,
          receiver_id: recipient.receiver_id, // Academic ID
          receiver_role: recipient.receiver_role,
          course_id,
          target_type
        }));

        await Notification.bulkCreate(notifications);

        return res.status(201).json({
          success: true,
          message: `Notification sent to ${totalCount} ${receiver_role}(s)`,
          count: totalCount
        });
      }
      case "COURSE": {
        const students = await Student.findAll({ where: { course_id } });
        const faculties = await Faculty.findAll({ where: { course_id } });
        const recipients = [
          ...students.map(student => ({
            receiver_id: student.student_id,
            receiver_role: "Student"
          })),
          ...faculties.map(faculty => ({
            receiver_id: faculty.faculty_id,
            receiver_role: "Faculty"
          }))
        ];
        const notifications = recipients.map(recipient => ({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id: recipient.receiver_id,
          receiver_role: recipient.receiver_role,
          course_id,
          target_type
        }));
        await Notification.bulkCreate(notifications);
        return res.status(201).json({
          success: true,
          message: `Notification sent to all users in course ${course_id}`,
          count: recipients.length
        });
      }
      
      default:
        return res.status(400).json({ message: "Invalid target_type." });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const UserId = req.user.uid;
    const userRole = req.user.role;
    const courseId = req.user.course_id;

    console.log("JWT payload:", {
      UserId,
      userRole,
      courseId
    });


    let academicId = null;
    try {
      const userRecord = await User.findOne({
        where: { user_id: UserId },
        attributes: ['username']
      });

      if (!userRecord) {
        console.log("User not found with ID:", UserId);
        return res.status(404).json({
          success: false,
          message: "User profile not found"
        });
      }

      academicId = userRecord.username;

      const studentRecord = await Student.findOne({
        where: { student_id: academicId }
      });

    } catch (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({
        success: false,
        message: "Error fetching user information"
      });
    }


    const whereCondition = {
      receiver_id: academicId, // Use academic ID '23BCA001'
      receiver_role: userRole // Use actual role from User table
    };

    // For students and faculty, filter by course_id
    if (userRole === "Student" || userRole === "Faculty") {
      whereCondition.course_id = courseId;
    }


    const notifications = await Notification.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'title',
        'message',
        'sender_id',
        'sender_role',
        'receiver_id',
        'receiver_role',
        'course_id',
        'class_id',
        'target_type',
        'created_at'
      ]
    });
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//to fetch all the student admin and faculty for notification purpose

export const fetchAllUsersForNotification = async (req, res) => {
  try {
    const course_id = req.user.course_id;

    const allUsers = await sequelize.query(
      `
      SELECT student_id AS id, name, 'Student' AS role
      FROM students
      WHERE course_id = :course_id

      UNION ALL

      SELECT faculty_id AS id, name, 'Faculty' AS role
      FROM faculties
      WHERE course_id = :course_id

      UNION ALL

      SELECT admin_id AS id, name, 'Admin' AS role
      FROM admins
      `,
      {
        replacements: { course_id },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      allUsers, // ✅ ARRAY
    });
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const course_id = req.user.course_id;
    const classes = await sequelize.query("SELECT class_id as id, section as name   FROM classes WHERE course_id = :course_id", {
      replacements: { course_id: req.user.course_id },
      type: QueryTypes.SELECT

    });
    console.log(classes);
    res.status(200).json(classes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
