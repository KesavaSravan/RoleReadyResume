const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(fileBuffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const renderPage = function(pageData) {
          let render_options = {
              normalizeWhitespace: false,
              disableCombineTextItems: false
          };

          return pageData.getTextContent(render_options)
          .then(function(textContent) {
              let text = '';
              for (let item of textContent.items) {
                  text += item.str + ' ';
              }
              return pageData.getAnnotations().then(function(annotations) {
                  let links = annotations.filter(a => a.subtype === 'Link' && !!a.url).map(a => a.url);
                  if (links.length > 0) {
                      text += '\n[Embedded Links: ' + links.join(', ') + ']\n';
                  }
                  return text;
              }).catch(() => text); // fallback if annotations fail
          });
      };

      const options = {
          pagerender: renderPage
      };

      const result = await pdfParse(fileBuffer, options);
      return result.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      // Use convertToHtml to preserve links, then parse to text
      const result = await mammoth.convertToHtml({ buffer: fileBuffer });
      let html = result.value;
      
      // Convert <a href="url">text</a> to "text (url)"
      let textWithLinks = html.replace(/<a\s+(?:[^>]*?\s+)?href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)');
      // Strip remaining HTML tags
      let plainText = textWithLinks.replace(/<[^>]+>/g, ' ');
      // Decode common HTML entities
      plainText = plainText.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      
      return plainText;
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
