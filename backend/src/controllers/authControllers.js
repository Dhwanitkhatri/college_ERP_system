// src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Role, Admin, Faculty, Student } from "../model/index.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Fetch user with role only
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    // 3️⃣ Fetch role-specific info
    let course_id = null;
    if (user.role.role_name === "Admin") {
      const admin = await Admin.findOne({ where: { user_id: user.id } });
      course_id = admin?.course_id || null;
    } else if (user.role.role_name === "Faculty") {
      const faculty = await Faculty.findOne({ where: { user_id: user.id } });
      course_id = faculty?.course_id || null;
    } else if (user.role.role_name === "Student") {
      const student = await Student.findOne({ where: { user_id: user.id } });
      course_id = student?.course_id || null;
    }

    // 4️⃣ Determine redirect URL based on role
    let redirectTo = "/student/dashboard";
    if (user.role.role_name === "Admin") redirectTo = "/admin/dashboard";
    if (user.role.role_name === "Faculty") redirectTo = "/faculty/dashboard";

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role_name: user.role.role_name,
        course_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 6️⃣ Send response
    res.json({
      message: "Login successful",
      token,
      role: user.role.role_name,
      course_id,
      redirectTo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
