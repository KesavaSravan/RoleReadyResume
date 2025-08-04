const documentService = require('../services/documentService');

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const fileBuffer = req.file.buffer;
        const mimetype = req.file.mimetype;

        const extractedText = await documentService.extractTextFromFile(fileBuffer, mimetype);
        
        res.json({ text: extractedText });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message || 'Failed to process document.' });
    }
};

module.exports = {
    uploadResume
};
