const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const documentController = require('../controllers/documentController');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.mimetype === 'application/msword') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'), false);
        }
    }
});

// Tailor Resume Endpoint
router.post('/tailor-resume', resumeController.tailorResume);

// Upload Resume Endpoint 
router.post('/upload-resume', upload.single('resumeFile'), documentController.uploadResume);

// Refine Resume Endpoint
router.post('/refine-resume', resumeController.refineResume);

// Score Resume Endpoint
router.post('/score-resume', resumeController.scoreResume);

// Cover Letter Endpoint
router.post('/generate-cover-letter', resumeController.generateCoverLetter);

module.exports = router;
