// NOTIFICATION CONTROLLER

import { Notification } from "../model/Notification.js";
import { sequelize } from "../config/db.js";
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Admin } from "../model/Admin.js";
import { Class } from "../model/Class.js";
import { User } from "../model/User.js";
import { QueryTypes, where } from "sequelize";

// Send notification
export const sendNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      receivers,      // 👈 NEW (for INDIVIDUAL)
      receiver_role,
      class_id,
      section,
      target_type,
    } = req.body;

    const sender_uid = req.user.uid;
    const sender_role = req.user.role;
    const course_id = req.user.course_id;

    /* ---------------- VALIDATION ---------------- */

    if (!title || !message || !target_type) {
      return res.status(400).json({
        success: false,
        message: "Title, message and target_type are required.",
      });
    }

    if (!["Admin", "Faculty"].includes(sender_role)) {
      return res.status(403).json({
        success: false,
        message: "Only Admin and Faculty can send notifications.",
      });
    }

    /* ---------------- GET SENDER USERNAME ---------------- */

    const senderUser = await User.findOne({
      where: { user_id: sender_uid },
      attributes: ["username"],
    });

    if (!senderUser) {
      return res.status(404).json({
        success: false,
        message: "Sender not found.",
      });
    }

    const senderUserName = senderUser.username;

    /* ===================================================== */
    /* ================= SWITCH TARGET TYPE ================= */
    /* ===================================================== */

    switch (target_type) {

      /* ===================================================== */
      /* ================= INDIVIDUAL (UPDATED) ============== */
      /* ===================================================== */

      case "INDIVIDUAL": {

        if (!receivers || !Array.isArray(receivers) || receivers.length === 0) {
          return res.status(400).json({
            success: false,
            message: "receivers array is required for INDIVIDUAL.",
          });
        }

        const notificationsData = [];

        for (let r of receivers) {
          const { receiver_id, receiver_role } = r;

          if (!receiver_id || !receiver_role) continue;

          let validReceiver = null;

          if (receiver_role === "Student") {
            validReceiver = await Student.findOne({
              where: { student_id: receiver_id, course_id },
            });
          }

          if (receiver_role === "Faculty") {
            validReceiver = await Faculty.findOne({
              where: { faculty_id: receiver_id, course_id },
            });
          }

          if (receiver_role === "Admin") {
            validReceiver = await Admin.findOne({
              where: { admin_id: receiver_id },
            });
          }

          if (!validReceiver) continue;

          notificationsData.push({
            title,
            message,
            sender_id: senderUserName,
            sender_role,
            receiver_id,          // 👈 stored per user
            receiver_role,        // 👈 stored per user
            course_id,
            target_type,
          });
        }

        if (notificationsData.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No valid receivers found.",
          });
        }

        await Notification.bulkCreate(notificationsData);

        return res.status(201).json({
          success: true,
          message: "Notification sent to selected individuals.",
        });
      }

      /* ===================================================== */
      /* ================= CLASS ============================= */
      /* ===================================================== */

      case "CLASS": {

        if (!class_id) {
          return res.status(400).json({
            success: false,
            message: "class_id is required for CLASS.",
          });
        }

        const classIds = Array.isArray(class_id)
          ? class_id
          : [class_id];

        const notificationsData = [];

        for (let clsId of classIds) {
          const classExists = await Class.findOne({
            where: { class_id: clsId, course_id },
          });

          if (!classExists) continue;

          notificationsData.push({
            title,
            message,
            sender_id: senderUserName,
            sender_role,
            receiver_id: null,
            receiver_role: "Student",
            course_id,
            class_id: clsId,
            section: section || null,
            target_type,
          });
        }

        if (notificationsData.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No valid classes found.",
          });
        }

        await Notification.bulkCreate(notificationsData);

        return res.status(201).json({
          success: true,
          message: "Notification sent to selected classes.",
        });
      }

      /* ===================================================== */
      /* ================= ROLE ============================== */
      /* ===================================================== */

      case "ROLE": {

        if (!receiver_role) {
          return res.status(400).json({
            success: false,
            message: "receiver_role is required for ROLE.",
          });
        }

        await Notification.create({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id: null,
          receiver_role,
          course_id,
          target_type,
        });

        return res.status(201).json({
          success: true,
          message: `Notification sent to role: ${receiver_role}`,
        });
      }

      /* ===================================================== */
      /* ================= COURSE ============================ */
      /* ===================================================== */

      case "COURSE": {

        await Notification.create({
          title,
          message,
          sender_id: senderUserName,
          sender_role,
          receiver_id: null,
          receiver_role: null,
          course_id,
          target_type,
        });

        return res.status(201).json({
          success: true,
          message: `Notification sent to entire course ${course_id}`,
        });
      }

      /* ===================================================== */
      /* ================= DEFAULT =========================== */
      /* ===================================================== */

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid target_type.",
        });
    }

  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
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
    const username = await User.findOne({
      where: { user_id: user_id },
      attributes: ['username']
    });
   
    let class_id = null;

    
   if (user_role === "Student") {
  const student = await Student.findOne({
    where: {
      user_id: user_id,
      course_id: course_id,
    },
    attributes: ["class_pk"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  });
    
      class_id = student?.class_id || null;
    }
    
    console.log("Class ID:", class_id);
    const notifications = await sequelize.query(
  `
  SELECT 
    n.*,

    COALESCE(
      f.name,
      a.name
    ) AS sender_name

  FROM notifications n

  LEFT JOIN faculties f
    ON n.sender_role = 'Faculty'
    AND f.faculty_id = n.sender_id
    AND f.course_id = n.course_id

  LEFT JOIN admins a
    ON n.sender_role = 'Admin'
    AND a.admin_id = n.sender_id
    AND a.course_id = n.course_id

  WHERE
        (n.target_type = 'COURSE' AND n.course_id = :course_id)
    OR
        (n.target_type = 'CLASS' AND n.class_id = :class_id AND n.course_id = :course_id)
    OR
        (n.target_type = 'ROLE' AND n.receiver_role = :role AND n.course_id = :course_id)
    OR
        (
          n.target_type = 'INDIVIDUAL'
          AND n.receiver_role = :role
          AND n.receiver_id = :user_id
          AND n.course_id = :course_id
        )

  ORDER BY n.created_at DESC
  `,
  {
    replacements: {
      course_id,
      role: user_role,
      user_id: username.username,
      class_id
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
//the notifications send by the logged-in user 
export const getMySentNotifications = async (req, res) => {
  try {
    const { uid, role, course_id } = req.user;

    let senderId;
    const user = await User.findOne({where:{user_id:uid}});
    //  Get actual sender_id from role table
    senderId = user.username;
    console.log(senderId)
    console.log(role);
    console.log(course_id);
    //  Now fetch notifications
    const notifications = await Notification.findAll({
      where: {
        sender_id: senderId,
        sender_role: role,
        course_id: course_id,
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
//update the send notifications
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({where:{user_id:req.user.uid}});
    const senderId =user.username;
    const notification = await Notification.findOne({
      where: {
        id: id,
        sender_id: senderId,
        sender_role: req.user.role,
      },
    });
    console.log(notification);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found or you are not authorized",
      });
    }

    const allowedFields = [
      "title",
      "message",
      "receiver_id",
      "receiver_role",
      "course_id",
      "class_id",
      "section",
      "target_type",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await notification.update(updateData);

    res.json({
      message: "Notification updated successfully",
      notification,
    });

  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete the send notifications
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({where:{user_id : req.user.uid}});

    const notification = await Notification.findOne({
      where: {
        id: id,
        sender_id: user.username,
        sender_role: req.user.role,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found or you are not authorized",
      });
    }

    await notification.destroy();

    res.json({
      message: "Notification deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;

    let senderId;

    const user = await User.findOne({where:{user_id:uid}});
    if(!user)
      return res.status(404).json({message:"user not found"});

    senderId = user.username;
    /* -------- Find Notification -------- */
    const notification = await Notification.findOne({
      where: {
        id: id,
        sender_id: senderId,   // ensures only creator can fetch
        sender_role: role,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {
    console.error("Error fetching notification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};