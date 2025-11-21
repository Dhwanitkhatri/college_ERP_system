//class controller.js
import { Class } from '../model/Class.js ';
import { Course } from '../model/Course.js ';
import { sequelize } from  '../config/db.js ';
import { Op } from 'sequelize';

// Create a new class (admins only)
export const createClass = async (req, res) => {
    const t= await sequelize.transaction(); //start transaction
    try {
        const { class_id, course_id, section } = req.body;
        // Validation to require fields 
        if (!class_id || !course_id || !section) {
            await t.rollback();
            return res.status(400).json({ message: "All fields are required" });
        }
        // Validation to check if class_id already exists
        const existingClass = await Class.findOne({ where: { class_id } });
        if (existingClass) {
            await t.rollback();
            return res.status(400).json({ message: "Class ID already exists" });
        }
        
        // Create new class
        const newClass = await Class.create({
            class_id,
            course_id,
            section
        }, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (error) {
        await t.rollback();
        console.error("Error creating class:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all classes
export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get classes by course_id
export const getClassesByCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const classes = await Class.findAll({ where: { course_id } });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update class by id (admins only)
export const updateClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const { class_id, course_id, section } = req.body;
        const classToUpdate = await Class.findByPk(id);
        if (!classToUpdate) {
            return res.status(404).json({ message: "Class not found" });
        }
        await classToUpdate.update({ class_id, course_id, section });
        res.json({ message: "Class updated successfully", class: classToUpdate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete class by id (admins only)
export const deleteClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classToDelete = await Class.findByPk(id);
        if (!classToDelete) {
            return res.status(404).json({ message: "Class not found" });
        }
        await classToDelete.destroy();
        res.json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






