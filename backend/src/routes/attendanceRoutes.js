import express from "express";
import { markAttendance , 
    getAttendance ,
    updateAttendance ,
     deleteAttendance,
      getStudentByClass,
       getSubjectsByFacultyAndClass , 
       getClasses,
       getLecturesBySubjectAndDate

 } from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, markAttendance);
router.get("/", authMiddleware, getAttendance);
router.get("/students/:class_id", authMiddleware, getStudentByClass);
router.get("/subjects/:class_id/:date", authMiddleware, getSubjectsByFacultyAndClass);
router.get("/lectures/:class_id/:subject_id/:date", authMiddleware, getLecturesBySubjectAndDate);
router.get("/classes", authMiddleware, getClasses);
router.put("/:id", authMiddleware, updateAttendance);
router.delete("/:id", authMiddleware, deleteAttendance);
export default router;