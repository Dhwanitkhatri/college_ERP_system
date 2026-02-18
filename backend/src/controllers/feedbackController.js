import { Feedback, Student} from "../model";

//submit the feedback by the student
export const submitFeedback = async (req, res) => {
  try {
    const { student_id, faculty_id, rating, comments } = req.body;

    if(!student_id || !faculty_id || !rating || !comments )
        return res.status(400).json("all field are require ");

    const feedback = await Feedback.create({
      student_id,
      faculty_id,
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
    const { studentId } = req.params;
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
    const feedbacks = await Feedback.findAll();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//fetch the pending feedback 
export const getPendingFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { status: "pending" }
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
