//Faculty Controller

import { Faculty } from "../model/Faculty.js";
import { User } from "../model/User.js";
import { Role } from "../model/Role.js";
import { Course } from "../model/Course.js";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";
import { generateFacultyId } from "../services/generateFacultyId.js";
import { responseTimeLogger } from "../middleware/responseTimeLogger.js";

// Create a new faculty (admins only)
export const createFaculty = async (req, res) => {
  const t = await sequelize.transaction(); //start transaction
  const course_id = req.user.course_id;
  const faculty_id = await generateFacultyId(req.user.course_id);
  try {
    const { name, phone, email } = req.body;

    const course = await Course.findOne({ where: { course_id } });
    if (!course) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid course_id" });
    }

    if (req.user.course_id !== course_id) {
      await t.rollback();
      return res.status(403).json({
        message: `You are not allowed to create Faculty for course ${course_id}`,
      });
    }

    // Get the role_id for 'Faculty'
    const facultyRole = await Role.findOne({ where: { role_name: "Faculty" } });
    if (!facultyRole) {
      await t.rollback();
      return res.status(400).json({ message: "Faculty role not found" });
    }

    //validation to require fields
    if (!faculty_id || !course_id || !name || !phone || !email) {
      await t.rollback();
      return res.status(400).json({ message: "All fields are required" });
    }
    //validation to check if faculty_id & email already exists
    const existingFaculty = await Faculty.findOne({ where: { faculty_id } });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty ID already exists" });
    }
    const existingEmail = await Faculty.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user for the faculty
    const tempPassword = "password";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const newUser = await User.create(
      {
        username: faculty_id,
        password: hashedPassword,
        role_id: facultyRole.role_id,
        status: "active",
      },
      { transaction: t },
    );

    // Create the faculty record
    const newFaculty = await Faculty.create(
      {
        faculty_id,
        user_id: newUser.user_id,
        course_id,
        name,
        phone,
        email,
      },
      { transaction: t },
    );
    await t.commit(); //commit transaction
    res
      .status(201)
      .json({ message: "Faculty created successfully", faculty: newFaculty });
  } catch (error) {
    await t.rollback(); //rollback transaction
    console.error("Error creating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all faculties
export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.findAll({
      where: { course_id: req.user.course_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: User,
          attributes: ["status"], // fetch status from users table
        },
      ],
    });

    res.json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
//get faculty by id
export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findOne({
      where: {
        id: id,
        course_id: req.user.course_id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update faculty by id


export const updateFacultyById = async (req, res) => {
  let t;

  try {
    t = await sequelize.transaction();

    const { id } = req.params;
    const { course_id, name, phone, email, password } = req.body;

    if (!course_id && !name && !phone && !email && !password) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    // 🔎 Find faculty WITH user relation
    const faculty = await Faculty.findOne({
      where: {
        id: id,
        course_id: req.user.course_id,
      },
      include: {
        model: User,
      },
      transaction: t,
    });

    if (!faculty) {
      await t.rollback();
      return res.status(404).json({
        message:
          "Faculty not found or you don't have access to update this faculty",
      });
    }

    // =========================
    // Update Faculty Table
    // =========================
    const updatedFacultyData = {};
    const allowedFields = ["course_id", "name", "phone"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updatedFacultyData[field] = req.body[field];
      }
    }

    if (Object.keys(updatedFacultyData).length > 0) {
      await faculty.update(updatedFacultyData, { transaction: t });
    }

    // =========================
    // Update User Table
    // =========================
    const updatedUserData = {};

    if (email) {
      updatedUserData.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUserData.password = hashedPassword;
    }

    if (Object.keys(updatedUserData).length > 0) {
      await faculty.User.update(updatedUserData, { transaction: t });
    }

    await t.commit();

    res.json({
      message: "Faculty updated successfully",
    });

  } catch (error) {
    if (t) await t.rollback();
    console.error("Error updating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const activeInactiveFaculty = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle status correctly
    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    return res.status(200).json({
      success: true,
      status: user.status,
      message: `User is now ${user.status}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//delete faculty by id
export const deleteFacultyById = async (req, res) => {
  const t = await sequelize.transaction(); //start transaction
  try {
    const { id } = req.params;
    const faculty = await Faculty.findOne({
      where: {
        id: id,
        course_id: req.user.course_id,
      },
      transaction: t,
    });
    if (!faculty) {
      await t.rollback();
      return res.status(404).json({
        message:
          "Faculty not found or you don't have access to delete this faculty",
      });
    }

    await faculty.destroy({ transaction: t });

    // Also delete the associated user
    const user = await User.findByPk(faculty.user_id);
    if (user) {
      await user.destroy({ transaction: t });
    }
    await t.commit();
    res.json({ message: "Faculty and associated user deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
