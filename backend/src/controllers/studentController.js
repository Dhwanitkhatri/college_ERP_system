//students controller
import { Student } from "../model/Student.js";
import { User } from "../model/User.js";
import { Role } from "../model/Role.js";
import { Course } from "../model/Course.js";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js";
import { generateEnrollmentId } from "../services/generateEnrollmentId.js";

// Create a new student(admins only)
export const createStudent = async (req, res) => {
    const t = await sequelize.transaction(); //start transaction
    const student_id = await generateEnrollmentId(req.user.course_id);
    const course_id = req.user.course_id; //assign course_id from admin creating 
    console.log("Generated student_id:", student_id);
    console.log("Admin's course_id:", req.user.course_id);
    console.log("Creating student for course_id:", course_id);
    try {
        const {
            // student_id,
            
            //class_id,
            name,
            dob,
            gender,
            email,
            admission_year,
            year_of_study,
        } = req.body;
        console.log("Request body:", req.body);
        const course = await Course.findOne({ where: {course_id} });
        if (!course) {
            await t.rollback();
            return res.status(400).json({ message: "Invalid course_id" });
        }

        if (req.user.course_id !== course_id) {
            await t.rollback();
            return res.status(403).json({
                message: `You are not allowed to create students for course ${course_id}`
            });
        }

        // Get the role_id for 'Student'
        const studentRole = await Role.findOne({ where: { role_name: "Student" } });
        if (!studentRole) {
            await t.rollback();
            return res.status(400).json({ message: "Student role not found" });
        }

        //validation to require fields
        if (
            !student_id ||
            !course_id ||
            //  !class_id ||
            !name ||
            !dob ||
            !gender ||
            !email ||
            !admission_year ||
            !year_of_study
        ) {
            await t.rollback();
            return res.status(400).json({ message: "All fields are required" });
        }
        //validation to check if student_id & email already exists
        const existingStudent = await Student.findOne({ where: { student_id } });
        if (existingStudent) {
            return res.status(400).json({ message: "Student ID already exists" });
        }
        const existingEmail = await Student.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        //validation for study year
        const validYears = ["FY", "SY", "TY", "LY"];
        if (!validYears.includes(year_of_study)) {
            await t.rollback();
            return res
                .status(400)
                .json({ message: "Year of study must be one of FY, SY, TY, LY" });
        }
        //validation for admission range
        if (admission_year < 2000 || admission_year > 2040) {
            await t.rollback();
            return res
                .status(400)
                .json({ message: "Admission year must be between 2000 and 2040" });
        }

        // Create a user for the student with a default password
        const defaultPassword = "password";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const newUser = await User.create(
            {
                username: student_id,
                password: hashedPassword,
                role_id: studentRole.role_id,
                status: "active",
            },
            { transaction: t }
        );
        console.log("Created user:", newUser.username);

        // Create the student record
        const newStudent = await Student.create(
            {
                student_id,
                user_id: newUser.user_id,
                course_id,
                //class_id,
                department_id: course.department_id,
                name,
                dob,
                gender,
                email,
                admission_year,
                year_of_study,
            },
            { transaction: t }
        );
        await t.commit();
        res.status(201).json({
            message: "Student created successfully",
            student: newStudent,
            login_info: {
                username: newUser.username,
                default_password: defaultPassword,
            },
        });
    } catch (error) {
        await t.rollback();
        console.error("Error creating student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { course_id: req.user.course_id },
            attributes: { exclude: ["createdAt", "updatedAt"] }
        });

        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a student by ID
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findOne({
            where: {
                id: id,
                course_id: req.user.course_id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a student by ID (admins only)
export const updateStudentById = async (req, res) => {
    const t = await sequelize.transaction(); //start transaction
    try {
        const { id } = req.params;
        const {
            course_id,
            class_id,
            name,
            dob,
            gender,
            email,
            admission_year,
            year_of_study,
        } = req.body;
        //validation for atleast one field to update
        if (
            !course_id &&
            !class_id &&
            !name &&
            !dob &&
            !gender &&
            !email &&
            !admission_year &&
            !year_of_study
        ) {
            await t.rollback();
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const student = await Student.findOne({
            where: {
                id: id,
                course_id: req.user.course_id
            },
            transaction: t
        });

        if (!student) {
            await t.rollback();
            return res.status(404).json({
                message: "Student not found or you don't have access to update this student"
            });
        }
        // Update only the provided fields
        const updateData = {};
        const allowedFields = [
            'course_id', 'class_id', 'name', 'dob', 'gender',
            'email', 'admission_year', 'year_of_study'
        ];
        //loop through allowed fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }
        await student.update(updateData, { transaction: t });
        await t.commit();

        const updatedStudent = await Student.findByPk(id);//fetch updated student
        res.json({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (error) {
        await t.rollback();
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a student by ID (admins only)
export const deleteStudentById = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const student = await Student.findOne({
            where: {
                id: id,
                course_id: req.user.course_id   // only delete if same course
            },
            transaction: t
        });

        if (!student) {
            await t.rollback();
            return res.status(403).json({
                success: false,
                message: "Access denied: You cannot delete students from another course (course filter applied)."
            });
        }

        await student.destroy({ transaction: t });
        const user = await User.findByPk(student.user_id, { transaction: t });
        if (user) {
            await user.destroy({ transaction: t });
        }

        await t.commit();
        return res.json({
            success: true,
            message: "Student and associated user deleted successfully"
        });
    } catch (error) {
        await t.rollback();
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
