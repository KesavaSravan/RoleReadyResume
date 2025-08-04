const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(fileBuffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error('File extraction error:', error);
    throw new Error('Failed to extract text from the uploaded file.');
  }
}

module.exports = {
  extractTextFromFile
};
