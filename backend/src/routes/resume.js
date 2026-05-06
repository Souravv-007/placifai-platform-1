const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Resolve absolute path to avoid confusion with relative paths
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'public/uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf', 
      'text/plain', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, and Word documents are allowed.'));
    }
  },
});

// Helper to handle multer errors
const uploadSingle = (req, res, next) => {
  const uploadMiddleware = upload.single('resume');
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/upload', authMiddleware, uploadSingle, resumeController.uploadResume);
router.post('/:resumeId/analyze', authMiddleware, resumeController.analyzeResume);
router.get('/', authMiddleware, resumeController.getResumes);
router.get('/:resumeId', authMiddleware, resumeController.getResumeById);
router.delete('/:resumeId', authMiddleware, resumeController.deleteResume);

module.exports = router;