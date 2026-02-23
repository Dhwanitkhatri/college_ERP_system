import { Feedback} from "../model/Feedback.js";
import { Student } from "../model/Student.js";
import { Faculty } from "../model/Faculty.js";
import { Timetable } from "../model/Timetable.js";
import { Op } from "sequelize";

//submit the feedback by the student
export const submitFeedback = async (req, res) => {
  try {
    const {faculty_id, rating, comments } = req.body;
    const course_id = req.user.course_id;
      const student = await Student.findOne({where:{user_id:req.user.uid}});

    if(!faculty_id || !rating || !comments )
        return res.status(400).json("all field are require ");
    if(!student)
        return res.status(404).json("student not found");
    const faculty = await Faculty.findOne({where:{faculty_id}});
    if(!faculty)
      return res.status(404).json("faculty not found");

    const feedback = await Feedback.create({
      student_id:student.student_id,
      faculty_id:faculty.faculty_id,
      course_id,
      rating,
      comments,
      date_submitted: new Date(),
      status: "pending"
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//student seeing there own feedback 
export const getStudentFeedback = async (req, res) => {
  try {
    const student = await Student.findOne({where:{user_id:req.user.uid}});
    const student_id = await Student.findOne({where:{user_id : studentId}})
    const feedback = await Feedback.findAll({
      where: { student_id: student_id }
    });

    res.json(feedback);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//for admin to fetch all the feedback 
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({where:{course_id:req.user.course_id}});
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//fetch the pending feedback 
export const getPendingFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { status: "pending",
        course_id:req.user.course_id 
      }
    });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//accept the feedback
export const acceptFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    await Feedback.update(
      { status: "accepted" },
      { where: { id } }
    );

    res.json({ message: "Feedback accepted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//reject the feedback 
export const rejectFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    await Feedback.update(
      { status: "rejected" },
      { where: { id } }
    );

    res.json({ message: "Feedback rejected" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//feddback view by the faculty 
export const getFacultyApprovedFeedback = async (req, res) => {
  try {
    // Find faculty using logged-in user
    const faculty = await Faculty.findOne({
      where: { user_id: req.user.uid }
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Fetch only accepted feedback for this faculty
    const feedbacks = await Feedback.findAll({
      where: {
        faculty_id: faculty.faculty_id,
        status: "accepted",
        course_id: req.user.course_id   // optional but recommended
      },
      include: [
        {
          model: Student,
          attributes: ["student_id", "name"] // optional fields
        }
      ],
      order: [["date_submitted", "DESC"]]
    });

    res.status(200).json({
      message: "Approved feedback fetched successfully",
      data: feedbacks
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get faculty list for logged-in student based on timetable
export const getFacultyForStudentFeedback = async (req, res) => {
  try {
    //  Find student using logged-in user
    const student = await Student.findOne({
      where: { user_id: req.user.uid }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    //  Get all timetable entries for student's class
    const timetables = await Timetable.findAll({
      where: {
        class_pk: student.class_pk
      },
      attributes: ["faculty_id"],
      group: ["faculty_id"]   // avoids duplicate faculty
    });

    if (!timetables.length) {
      return res.status(404).json({ message: "No faculty assigned to this class" });
    }

    //  Extract faculty_ids
    const facultyIds = timetables.map(t => t.faculty_id);

    //  Fetch faculty details
    const faculties = await Faculty.findAll({
      where: {
        faculty_id: {
          [Op.in]: facultyIds
        }
      },
      attributes: ["faculty_id", "name"] // adjust as needed
    });

    res.status(200).json({
      data: faculties
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
