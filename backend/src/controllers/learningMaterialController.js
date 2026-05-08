import { LearningMaterial } from '../model/LearningMaterial.js';
import { Subject } from '../model/Subject.js';
import { Faculty } from '../model/Faculty.js';
import { Class } from '../model/Class.js';
import {Student} from "../model/Student.js"
import { Timetable } from '../model/Timetable.js'; 
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure upload directory
const UPLOAD_DIR = path.join(__dirname, '../../uploads/learning-materials');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed file types
const ALLOWED_TYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'mp4', 'zip'];

// ======================
// UPLOAD MATERIAL (Faculty only)
// ======================
export const uploadMaterial = async (req, res) => {
    try {
        const user = req.user;
        // Check role: must be Faculty
        if (user.role !== 'Faculty') {
            return res.status(403).json({ success: false, message: 'Access denied: Faculty only' });
        }

        // Get faculty_id from Faculty table using user_id
        const faculty = await Faculty.findOne({ where: { user_id: user.uid } });
        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty profile not found' });
        }
        const faculty_id = faculty.faculty_id;

        const { title, description, subject_id, class_pk } = req.body;
        const course_id = user.course_id; // from token

        if (!title || !subject_id || !class_pk) {
            return res.status(400).json({ success: false, message: 'Missing required fields: title, subject_id, class_pk' });
        }

        // Verify subject exists and belongs to same course
        const subject = await Subject.findOne({ where: { subject_id, course_id } });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Subject not found in this course' });
        }

        // Verify class exists and belongs to same course
        const classRecord = await Class.findOne({ where: { id: class_pk, course_id } });
        if (!classRecord) {
            return res.status(404).json({ success: false, message: 'Class not found in this course' });
        }

        // ✅ Check if faculty is assigned to this subject for this class via Timetable
        const timetableEntry = await Timetable.findOne({
            where: {
                faculty_id,
                subject_id,
                class_pk
            }
        });
        if (!timetableEntry) {
            return res.status(403).json({ success: false, message: 'You are not assigned to teach this subject for this class' });
        }

        // Handle file upload
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.file;
        const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
        if (!ALLOWED_TYPES.includes(fileExt)) {
            fs.unlinkSync(file.path); // remove temp file
            return res.status(400).json({ success: false, message: 'File type not allowed' });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${file.originalname.replace(/\s/g, '_')}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFilename);

        // Move file from temp location to uploads directory
        fs.renameSync(file.path, filePath);

        // Save to database
        const material = await LearningMaterial.create({
            title,
            description,
            file_path: `uploads/learning-materials/${uniqueFilename}`,
            file_type: fileExt,
            file_size: Math.round(file.size / 1024), // KB
            subject_id,
            faculty_id,
            class_pk,
            course_id
        });

        res.status(201).json({
            success: true,
            message: 'Material uploaded successfully',
            data: material
        });
    } catch (error) {
        // If file was uploaded, remove it on error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// GET ALL MATERIALS (with filters)
// ======================
export const getMaterials = async (req, res) => {
    try {
        const user = req.user;
        const { subject_id, class_pk, course_id: queryCourseId } = req.query;

        const where = {};

        if (user.role === "Student" || user.role === "Faculty") {
            where.course_id = user.course_id;
        } 
        else if (user.role === "Admin" && queryCourseId) {
            where.course_id = queryCourseId;
        }

        if (subject_id) where.subject_id = subject_id;
        if (class_pk) where.class_pk = class_pk;

        const materials = await LearningMaterial.findAll({
            where,
            include: [
                {
                    model: Subject,
                    attributes: ["subject_id", "subject_name"]
                },
                {
                    model: Faculty,
                    attributes: ["name"]
                },
                {
                    model: Class,
                    attributes: ["class_id", "section"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.json({
            success: true,
            data: materials
        });

    } catch (error) {
        console.error("Error fetching materials:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
// GET SINGLE MATERIAL METADATA
// ======================
export const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const material = await LearningMaterial.findByPk(id, {
            include: [
                { model: Subject, attributes: ['subject_name'] },
                { model: Faculty, attributes: ['name'] },
                { model: Class, attributes: ['class_id', 'section'] }
            ]
        });

        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }

        // Check course access
        if (user.role !== 'Admin' && material.course_id !== user.course_id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: material });
    } catch (error) {
        console.error('Error fetching material:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// DOWNLOAD MATERIAL
// ======================




export const downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await LearningMaterial.findByPk(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    const filePath = path.join(__dirname, "../../", material.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // filename with extension
    const fileName = `${material.title}.${material.file_type}`;

    // this automatically sets correct headers
    res.download(filePath, fileName);

  } catch (error) {
    console.error("Error downloading material:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// DELETE MATERIAL (Faculty only – must be owner)
// ======================
export const deleteMaterial = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (user.role !== 'Faculty') {
            return res.status(403).json({ success: false, message: 'Access denied: Faculty only' });
        }

        // Get faculty_id
        const faculty = await Faculty.findOne({ where: { user_id: user.uid } });
        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty profile not found' });
        }
        const faculty_id = faculty.faculty_id;

        const material = await LearningMaterial.findOne({
            where: { id, faculty_id, course_id: user.course_id }
        });

        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found or not owned by you' });
        }

        // Delete file from disk
        const filePath = path.join(__dirname, '../../', material.file_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await material.destroy();
        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
//fetch the suject for the faculty 
export const getFacultySubjectsByClass = async (req, res) => {
  try {
    const { class_id } = req.query;
    const faculty = await Faculty.findOne({where:{user_id : req.user.uid},
        attributes:{
            include:["faculty_id"]
        }
    });
    const faculty_id = faculty.faculty_id;

    if (!class_id) {
      return res.status(400).json({
        message: "class_id is required"
      });
    }

    const subjects = await Timetable.findAll({
      where: {
        class_pk: class_id,
        faculty_id: faculty_id
      },
      attributes: ["subject_id"],
      include: [
        {
          model: Subject,
          attributes: ["subject_id", "subject_name"]
        }
      ],
      group: ["subject_id"]
    });

    res.status(200).json({
      success: true,
      data: subjects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching subjects"
    });
  }
};
export const getSubjectsFromTimetable = async (req, res) => {
    try {
        const user = req.user;

        // Only students should access this
        if (user.role !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only students can access subjects."
            });
        }
        const student = await Student.findOne({where:{user_id : user.uid},
            attributes:{
                include:["class_pk"]
            }
        })
        const classPk = student.class_pk;

        if (!classPk) {
            return res.status(400).json({
                success: false,
                message: "Student class not found"
            });
        }

        // Find all timetable entries for the student's class
        const timetableEntries = await Timetable.findAll({
            where: { class_pk: classPk },
            attributes: ["subject_id"]
        });

        if (!timetableEntries.length) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Remove duplicate subject ids
        const subjectIds = [
            ...new Set(timetableEntries.map(item => item.subject_id))
        ];

        // Fetch subject details
        const subjects = await Subject.findAll({
            where: {
                subject_id: subjectIds
            },
            attributes: ["subject_id", "subject_name"]
        });

        res.json({
            success: true,
            data: subjects
        });

    } catch (error) {
        console.error("Error fetching subjects from timetable:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
