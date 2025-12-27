//class controller.js
import { Class } from '../model/Class.js ';


// Create a new class (admins only)
export const createClass = async (req, res) => {
  try {
    const  course_id  = req.user.course_id;
    const {  year, semester, sections, academic_year } = req.body;
    console.log(course_id, year, semester, sections, academic_year);
    // Validation
    const validSemesters = {
      1: [1, 2],
      2: [3, 4],
      3: [5, 6],
      4: [7, 8]
    };

    if (!validSemesters[year]?.includes(semester)) {
      return res.status(400).json({
        message: "Invalid semester for selected year"
      });
    }

    const yearMap = { 1: "FY", 2: "SY", 3: "TY" , 4: "FY" };
    const created = [];
    const course = course_id.replace(/\d/g, '');
    for (const section of sections) {
      const class_id = `${yearMap[year]}_${course}_${section}`;

      const cls = await Class.create({
        class_id,
        course_id,
        year,
        semester,
        section,
        academic_year
      });

      created.push(cls);
    }

    res.status(201).json({
      message: "Classes created successfully",
      data: created
    });

  } catch (error) {
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

    const allowedFields = ["section", "academic_year"];
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







