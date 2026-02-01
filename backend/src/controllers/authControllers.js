// src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Role, Admin, Faculty, Student } from "../model/index.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user + role in one optimized query
    const user = await User.findOne({
      where: { username },
      attributes: ["user_id", "username", "password", "role_id" , "status"],
      include: [
        {
          model: Role,
          attributes: ["role_name"],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password BEFORE more DB calls
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });
    if(user.status === 'inactive'){
      return res.status(403).json({message :'Access Denied'});
    }
    //  Fetch course_id based on role — only ONE query
    let courseData = null;
    const role = user.Role.role_name;

    if (role === "Admin") {
      courseData = await Admin.findOne({
        where: { user_id: user.user_id },
        attributes: ["course_id" , "name"],
      });
    } else if (role === "Faculty") {
      courseData = await Faculty.findOne({
        where: { user_id: user.user_id },
        attributes: ["course_id" , "name"],
      });
    } else if (role === "Student") {
      courseData = await Student.findOne({
        where: { user_id: user.user_id },
        attributes: ["course_id" , "name"],
      });
    }

    const course_id = courseData?.course_id || null;
    //const name = courseData?.name || null;

    //  Lightweight JWT payload → smaller token → faster sign
    const token = jwt.sign(
      {
        uid: user.user_id,
        role,
        course_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    //  Precomputed redirect
    const roleRedirectMap = {
  Admin: "/admin/dashboard",
  Faculty: "/faculty/dashboard",
  Student: "/student/dashboard",
};

const redirectTo = roleRedirectMap[role] || "/student/dashboard";


    return res.json({
      message: "Login successful",
      token,
      role,
      course_id,
      redirectTo,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
