// NOTIFICATION CONTROLLER

import { Notification } from "../model/Notification.js";
import { sequelize } from "../config/db.js";
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Course } from "../model/Course.js";
import { QueryTypes } from "sequelize";
import { includes } from "zod";


// Create a new notification for students + faculty (admins only)
export const createNotification = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { notification_id, title, message, date } = req.body;

        if (!title || !message) {
            await t.rollback();
            return res.status(400).json({
                message: "You need to provide both a title and message"
            });
        }

        const course = await Course.findOne({
            where: { course_id: req.user.course_id }
        });

        if (!course) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Course does not exist!"
            });
        }

        const students = await Student.findAll({
            where: { course_id: req.user.course_id },
            attributes: ["user_id"],
            transaction: t
        });

        const facultyMembers = await Faculty.findAll({
            where: { course_id: req.user.course_id },
            attributes: ["user_id"],
            transaction: t
        });

        const userIds = [
            ...students.map(s => s.user_id),
            ...facultyMembers.map(f => f.user_id)
        ];

        const notifications = userIds.map(uid => ({
            notification_id: `${notification_id}-${uid}`,
            title,
            message,
            date,
            user_id: uid,
            read_status: false
        }));

        await Notification.bulkCreate(notifications, { transaction: t });

        await t.commit();
        res.status(201).json({
            success: true,
            message: `Notification sent to ${userIds.length} people`,
            data: {
                title,
                message,
                total: userIds.length,
                students: students.length,
                faculty: facultyMembers.length
            }
        });

    } catch (error) {
        await t.rollback();
        console.error("Error sending notification:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while sending the notification"
        });
    }
};

// Send group notification (students or faculty)
export const sendGroupNotification = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { notification_id, title, message, date, group } = req.body;

        if (!title || !message || !group || !["students", "faculty"].includes(group)) {
            await t.rollback();
            return res.status(400).json({
                message: "Provide a title, message, and valid group (students/faculty)"
            });
        }

        const course = await Course.findOne({
            where: { course_id: req.user.course_id }
        });

        if (!course) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Course does not exist!"
            });
        }

        let recipients =
            group === "students"
                ? await Student.findAll({
                      where: { course_id: req.user.course_id },
                      attributes: ["user_id"],
                      transaction: t
                  })
                : await Faculty.findAll({
                      where: { course_id: req.user.course_id },
                      attributes: ["user_id"],
                      transaction: t
                  });

        const userIds = recipients.map(r => r.user_id);

        const notifications = userIds.map(uid => ({
            notification_id: `${notification_id}-${uid}`,
            title,
            message,
            date,
            user_id: uid,
            read_status: false
        }));

        await Notification.bulkCreate(notifications, { transaction: t });

        await t.commit();
        res.status(201).json({
            success: true,
            message: `Notification sent successfully to ${userIds.length} ${group}`,
            data: {
                notification_id,
                sent_to: userIds.length,
                group,
                title,
                message
            }
        });

    } catch (error) {
        await t.rollback();
        console.error("Error sending group notification:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// Get all notifications (admin only)
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [["date", "DESC"]]
        });

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// Get notifications for logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.uid },
            order: [["date", "DESC"]]
        });
        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error("Error fetching user notifications:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// send class-specific and Year  notification (admins only)
export const sendClassYearNotification = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { notification_id, title, message, date, class_id, year } = req.body;
        if (!title || !message || !class_id || !year) {
            await t.rollback();
            return res.status(400).json({
                message: "Provide title, message, class_id, and year"
            });
        }   
        const students = await Student.findAll({
            where: {
                course_id: req.user.course_id,
                class_id,
                year_of_study: year
            },
            attributes: ["user_id"],
            transaction: t
        });
        const userIds = students.map(s => s.user_id);

        if (userIds.length === 0) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "No students found for the specified class and year"
            });
        }
        const notifications = userIds.map(uid => ({
            notification_id: `${notification_id}-${uid}`,
            title,
            message,
            date,
            user_id: uid,
            read_status: false
        }));
        await Notification.bulkCreate(notifications, { transaction: t });
        await t.commit();
        res.status(201).json({
            success: true,
            message: `Notification sent to ${userIds.length} students in class ${class_id}, year ${year}`,
            data: {
                title,
                message,
                total: userIds.length,
                class_id,
                year
            }
        });
    } catch (error) {
        await t.rollback();
        console.error("Error sending class-year notification:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// Send notification to a single user (admin only)
export const sendSingleUserNotification = async (req, res) => {
    try {
        const { notification_id, title, message, date, user_id } = req.body;
        if (!title || !message || !user_id) {
            return res.status(400).json({
                message: "Provide title, message, and user_id"
            });
        }
        const notification = await Notification.create({
            notification_id,
            title,
            message,
            date,
            user_id,
            read_status: false
        });
        res.status(201).json({  
            success: true,
            message: "Notification sent successfully",
            data: notification
        });
    }catch (error) {
        console.error("Error sending single user notification:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }   
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const { notification_id } = req.params;

        const notification = await Notification.findOne({
            where: { notification_id, user_id: req.user.uid }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        notification.read_status = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });

    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// Delete a single notification
export const deleteNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;

        const notification = await Notification.findOne({
            where: { notification_id, user_id: req.user.uid }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        await notification.destroy();

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

// Delete all notifications (admin only)
export const deleteAllNotifications = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete all notifications"
            });
        }

        const deleted = await Notification.destroy({ where: {} });

        res.status(200).json({
            success: true,
            message: deleted === 0 ? "No notifications found" : "All notifications deleted"
        });

    } catch (error) {
        console.error("Error deleting all notifications:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


//to fetch all the student admin and faculty for notification purpose

export const fetchAllUsersForNotification = async (req, res) => {
  try {
    const course_id = req.user.course_id;

    const allUsers = await sequelize.query(
      `
      SELECT student_id AS id, name, 'student' AS role
      FROM students
      WHERE course_id = :course_id

      UNION ALL

      SELECT faculty_id AS id, name, 'faculty' AS role
      FROM faculties
      WHERE course_id = :course_id

      UNION ALL

      SELECT admin_id AS id, name, 'admin' AS role
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
    console.error("Error fetching users:", error);
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
        res.status(500).json({ message: error.message });
    }
};