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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server health
 *     description: Returns the status of the server
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (req, res) => {
    res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /tailor-resume:
 *   post:
 *     summary: Tailor the uploaded resume to a job description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeText:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tailored resume output
 */
router.post('/tailor-resume', resumeController.tailorResume);

/**
 * @swagger
 * /upload-resume:
 *   post:
 *     summary: Upload and parse a resume file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resumeFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Parsed text from the resume
 */
router.post('/upload-resume', upload.single('resumeFile'), documentController.uploadResume);

/**
 * @swagger
 * /refine-resume:
 *   post:
 *     summary: Refine a section of the resume based on instructions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentResume:
 *                 type: string
 *               instruction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refined resume output
 */
router.post('/refine-resume', resumeController.refineResume);

/**
 * @swagger
 * /score-resume:
 *   post:
 *     summary: Get ATS score for resume
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeText:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Score and feedback data
 */
router.post('/score-resume', resumeController.scoreResume);

/**
 * @swagger
 * /generate-cover-letter:
 *   post:
 *     summary: Generate a cover letter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeText:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cover letter output
 */
router.post('/generate-cover-letter', resumeController.generateCoverLetter);

module.exports = router;
