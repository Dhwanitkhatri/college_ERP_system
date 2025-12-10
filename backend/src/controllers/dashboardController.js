// src/controllers/dashboardController.js
import { Admin } from "../model/Admin.js";
import { Faculty } from "../model/Faculty.js";
import { Student } from "../model/Student.js";

export const getDashboardData = async (req, res) => {
  try {
    const { uid, role } = req.user; // comes from JWT

    let dashboardData = null;

    if (role === "Admin") {
      dashboardData = await Admin.findOne({
        where: { user_id: uid },
        attributes: { exclude: ["password"] }
      });
    }
    else if (role === "Faculty") {
      dashboardData = await Faculty.findOne({
        where: { user_id: uid },
        attributes: { exclude: ["password"] }
      });
    }
    else if (role === "Student") {
      dashboardData = await Student.findOne({
        where: { user_id: uid },
        attributes: { exclude: ["password"] }
      });
    }
    else {
      return res
        .status(400)
        .json({ message: `Invalid role: ${role}` });
    }

    if (!dashboardData) {
      return res.status(404).json({ message: "Dashboard data not found" });
    }

    return res.json({
      message: `${role} dashboard fetched successfully`,
      role,
      data: dashboardData
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching dashboard data",
      error: error.message
    });
  }
};
