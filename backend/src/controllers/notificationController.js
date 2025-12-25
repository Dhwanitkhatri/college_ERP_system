// NOTIFICATION CONTROLLER

import { Notification } from "../model/Notification.js";
import { sequelize } from "../config/db.js";
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Admin } from "../model/Admin.js";
import { Class } from "../model/Class.js";
import { User } from "../model/User.js";
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

        

        await Notification.create({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id: null, // Academic ID
          receiver_role: null,
          course_id,
          class_id,
          section,
          target_type
        });
       
        return res.status(201).json({
          success: true,
          message: `Notification sent to students in class ${class_id}`,
        });

      }
      case "ROLE": {
        if (!receiver_role) {
          return res.status(400).json({ message: "receiver_role is required for ROLE target_type." });
        }
        

       
        await Notification.create({
          title,
          message,
          sender_id: senderUserName, // Use academic ID
          sender_role: sender_role,
          receiver_id: null, // Academic ID
          receiver_role:receiver_role,
          course_id,
          target_type
        });

        

        return res.status(201).json({
          success: true,
        });
      }
      case "COURSE": {
        
        const notifications = Notification.create({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id: null,
          receiver_role: null,
          course_id,
          target_type
        });
        await Notification.bulkCreate(notifications);
        return res.status(201).json({
          success: true,
          message: `Notification sent to all users in course ${course_id}`,
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
    const user_id = req.user.uid;
    const user_role = req.user.role;        // STUDENT | FACULTY | ADMIN
    const course_id = req.user.course_id;
    console.log("User Role:", user_role);
    console.log(user_id);

    if (!user_id || !user_role || !course_id) {
      return res.status(400).json({ message: "Invalid user credentials." });
    }

   
    let class_id = null;

    
    if (user_role === 'Student') {
      const student = await Student.findOne({
        where: {
          student_id: user_id,
          course_id: course_id
        },
        attributes: ['class_id']
      });

      class_id = student?.class_id || null;
    }
    console.log("Class ID:", class_id);
    const notifications = await sequelize.query(
      `
      SELECT *
      FROM notifications
      WHERE
    
        (target_type = 'COURSE' and course_id = :course_id)
        OR
        (target_type = 'CLASS' AND class_id = :class_id and course_id = :course_id)
        OR
        (target_type = 'ROLE' AND receiver_role = :role and course_id = :course_id)
        OR
          (
            target_type = 'INDIVIDUAL'
            AND receiver_role = :role
            AND receiver_id = :user_id
            and course_id = :course_id
          )
    
      ORDER BY created_at DESC
      `,
      {
        replacements: {
          course_id,
          role: user_role,
          user_id,
          class_id   // NULL for faculty/admin → auto ignored
        },
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).json({ notifications });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      allUsers, // Array of users with id, name, and role
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
    
    const classes = await sequelize.query("SELECT class_id as id, section as role   FROM classes WHERE course_id = :course_id", {
      replacements: { course_id: req.user.course_id },
      type: QueryTypes.SELECT

    });
    res.status(200).json(classes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
