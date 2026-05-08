import jwt from "jsonwebtoken";
import { User } from "../model/User.js";
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Admin } from "../model/Admin.js";
import { sendEmail } from "../services/sendEmail.js";
import bcrypt from "bcrypt"

export const sendResetOTP = async (req, res) => {
  try {

    const { username } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let email = null;

    // role_id example
    // 1 = Admin
    // 2 = Faculty
    // 3 = Student

    if (user.role_id === "ROLE001") {
      const admin = await Admin.findOne({ where: { user_id:user.user_id } });
      email = admin?.email;
    }

    if (user.role_id === "ROLE002") {
      const faculty = await Faculty.findOne({ where: {user_id:user.user_id } });
      email = faculty?.email;
    }

    if (user.role_id === "ROLE003") {
      const student = await Student.findOne({ where: {user_id:user.user_id } });
      email = student?.email;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is: ${otp}`
    );

    const token = jwt.sign(
      { username, otp },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({
      success: true,
      message: "OTP sent to registered email",
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const verifyOTPAndResetPassword = async (req, res) => {

  try {

    const { token, otp, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    const user = await User.findOne({
      where: { username: decoded.username }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};