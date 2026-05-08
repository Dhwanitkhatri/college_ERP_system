import { Subject } from "../model/index.js";
import { sequelize } from "../config/db.js";

export const createSubject = async (req, res) => {
  const t = await sequelize.transaction();
  const course_id = req.user.course_id; // Assuming course_id is available in req.
  // user

  try {
    const { subject_name, credit, semester, lecture_per_week } =
      req.body;
    const course = course_id.replace(/\d/g, "");

    const count = await Subject.count({
      where: { course_id },
    });

    const subject_id = `SUB${course}${String(count + 1).padStart(3, "0")}`;

    // Validation to require fields
    if (
      !subject_name ||
      !course_id ||
      !credit ||
      
      !semester ||
      !lecture_per_week
    ) {
      await t.rollback();
      return res.status(400).json({ message: "All fields are required" });
    }
    // Validation to check if subject_id already exists
    const existingSubject = await Subject.findOne({ where: { subject_id } });
    if (existingSubject) {
      await t.rollback();
      return res.status(400).json({ message: "Subject ID already exists" });
    }

    // Create new subject
    const newSubject = await Subject.create(
      {
        subject_id,
       
        course_id,
        subject_name,
        credit,
        semester,
        lecture_per_week,
      },
      { transaction: t },
    );
    await t.commit();
    res
      .status(201)
      .json({ message: "Subject created successfully", subject: newSubject });
  } catch (error) {
    await t.rollback();
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const course_id = req.user.course_id;
    const subjects = await Subject.findAll({where:{course_id}});
    if(!subjects)
      return res.status(404).json({message:"no subjects found"});
    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const subject = await Subject.findOne({ where: { subject_id } });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ subject });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubjectById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { subject_id } = req.params;
    const { subject_name, course_id, credits } = req.body;
    const subject = await Subject.findOne({ where: { subject_id } });
    if (!subject) {
      await t.rollback();
      return res.status(404).json({ message: "Subject not found" });
    }
    await subject.update(
      {
        subject_name: subject_name || subject.subject_name,
        course_id: course_id || subject.course_id,
        credits: credits || subject.credits,
      },
      { transaction: t },
    );
    await t.commit();
    res.status(200).json({ message: "Subject updated successfully", subject });
  } catch (error) {
    await t.rollback();
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteSubjectById = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { subject_id } = req.params;
    const subject = await Subject.findOne({ where: { subject_id } });
    if (!subject) {
      await t.rollback();
      return res.status(404).json({ message: "Subject not found" });
    }
    await subject.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
