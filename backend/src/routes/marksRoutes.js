import express from "express";
import { enterMarks , updateMarks , bulkEnterMarks ,
     getSubjectsBySemester,
  getComponentsBySubject,
  getExamsBySemesterYear,
  getStudentsByExam
} from "../controllers/marksController.js";
import { authMiddleware ,adminMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();
router.get(
  "/subjects/:semester",
  authMiddleware,
  getSubjectsBySemester
);

// Fetch components based on subject
router.get(
  "/components/:subject_id",
  authMiddleware,
  getComponentsBySubject
);

// Fetch exams based on semester + academic year
router.get(
  "/exams",
  authMiddleware,
  getExamsBySemesterYear
);

// Fetch students based on exam (semester derived from exam)
router.get(
  "/students-by-exam/:exam_id",
  authMiddleware,
  getStudentsByExam
);


router.post("/enter-marks", authMiddleware,adminMiddleware, enterMarks);
router.post("/bulk-enter-marks", authMiddleware,adminMiddleware, bulkEnterMarks);
router.put("/update-marks", authMiddleware,adminMiddleware, updateMarks);

export default router;
