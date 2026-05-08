//class controller.js
import { Class } from '../model/Class.js ';
import {getCurrentAcademicYear , getSemesterType} from '../services/academicYear.js';
import { sequelize } from "../config/db.js";
import { Student } from '../model/Student.js ';
import {Faculty}from '../model/Faculty.js';
import { Op, fn, col } from 'sequelize';

// Create a new class (admins only)
export const createClass = async (req, res) => {
  try {
    const  course_id  = req.user.course_id;
    const {  year, semester, sections, academic_year, mentor_id } = req.body;
    
    // Validation
    const validSemesters = {
      'FY': [1, 2],
      'SY': [3, 4],
      'TY': [5, 6],
      'LY': [7, 8]
    };

    if (!validSemesters[year]?.includes(Number(semester))) {
      return res.status(400).json({
        message: "Invalid semester for selected year"
      });
    }

    
    const created = [];
    const course = course_id.replace(/\d/g, '');
    for (const section of sections) {
      const class_id = `${year}_${course}_${section}`;

      const cls = await Class.create({
        class_id,
        course_id,
        year,
        semester:Number(semester),
        section,
        academic_year,
        mentor_id
      });

      created.push(cls);
    }

    res.status(201).json({
      message: "Classes created successfully",
      data: created
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const { course_id, academic_year, year, semester } = req.query;

    const where = {};
    if (course_id) where.course_id = course_id;
    if (academic_year) where.academic_year = academic_year;
    if (year) where.year = year;
    if (semester) where.semester = semester;

    const classes = await Class.findAll({
      where,
      order: [["year", "ASC"], ["semester", "ASC"], ["section", "ASC"]]
    });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update class by id (admins only)
export const updateClass = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const allowedFields = ["section", "academic_year","mentor_id"];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    await cls.update(updates);

    res.json({
      message: "Class updated successfully",
      data: cls
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete class by id (admins only)
export const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    await cls.destroy();
    res.json({ message: "Class deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//to fetch the classes of current academic year


export const getCurrentYearClasses = async (req, res) => {
  try {
    const academic_year = getCurrentAcademicYear();
    const sem_type = getSemesterType();

    const semesterCondition =
      sem_type === "odd" ? [1, 3, 5] : [2, 4, 6];

    const classes = await Class.findAll({
      where: {
        academic_year,
        semester: { [Op.in]: semesterCondition },
        course_id:req.user.course_id
      },
      attributes: [
        "id",
        "class_id",
        "course_id",
        "year",
        "semester",
        "section",

        // total students
        [fn("COUNT", col("Students.id")), "total_students"],

        // mentor name (NULL-safe)
        [col("Faculty.name"), "mentor_name"]
      ],
      include: [
        {
          model: Student,
          attributes: [],
          required: false
        },
        {
          model: Faculty,
          attributes: [],
          required: false   // LEFT JOIN → mentor optional
        }
      ],
      group: [
        "Class.id",
        "Faculty.faculty_id",
        "Faculty.name"
      ],
      order: [
        ["year", "ASC"],
        ["semester", "ASC"],
        ["section", "ASC"]
      ]
    });

    res.json({
      academic_year,
      semester_type: sem_type,
      total_classes: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//fetch the class using the id 
export const getClassById = async (req, res) => {
  try {
    const id = req.params.id;
    const cls = await Class.findByPk(id, {
      include: [
        {
          model: Faculty,
          attributes: ["faculty_id", "name"],
          required: false
        }
      ]
    });

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(cls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};