// profileUpload.js - 
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create directory if it doesn't exist
const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."), false);
    }
};

// Create multer instance
const createUpload = () => {
    const storage = multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            // Add timestamp to avoid cache issues
            const timestamp = Date.now();
            cb(null, `${req.user.uid}_${timestamp}${extension}`);
        }
    });

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }
    });
};

// Export as a function that returns the upload middleware
export const profileUpload = (req, res, next) => {
    const upload = createUpload().single('photo');
    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: "File too large. Maximum size is 5MB."
                    });
                }
            }
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed"
            });
        }
        next();
    });
};