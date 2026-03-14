import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } from 'docx';
import html2pdf from 'html2pdf.js';

// ATS-Optimized formatting configurations
const ATS_CONFIG = {
  pdf: {
    font: 'helvetica', // ATS-friendly font
    fontSize: {
      name: 16,
      title: 14,
      heading: 12,
      body: 11,
      small: 10
    },
    margins: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    },
    lineHeight: 1.2,
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#555555'
    }
  },
  word: {
    fontSize: {
      name: 24, // 12pt in half-points
      title: 22, // 11pt
      heading: 20, // 10pt
      body: 18, // 9pt
    },
    spacing: {
      before: 120, // 6pt
      after: 120   // 6pt
    }
  }
};

// CSS styles as a template literal string
const modalStyles = `
/* --- Download Modal Overlay and Container --- */
.download-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.download-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  max-height: 90vh; /* Set a maximum height relative to the viewport */
  overflow-y: auto; /* Enable vertical scrolling */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease-out;
  position: relative;
}

/* --- Modal Header --- */
.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.modal-icon-container {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon {
  fill: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.modal-header p {
  margin: 8px 0 0;
  color: #718096;
  font-size: 16px;
}

/* --- Close Button --- */
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.modal-close-btn svg {
  color: #a0aec0; /* A soft gray color */
}

.modal-close-btn:hover {
  opacity: 0.7;
}

/* --- Format Options --- */
.format-options {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.format-option {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.format-option:hover.hover,
.format-option.selected {
  border-color: #667eea;
  background: #f7fafc;
}

.format-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  fill: white;
  flex-shrink: 0;
}

.pdf-icon {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.word-icon {
  background: linear-gradient(135deg, #2196f3, #1976d2);
}

.format-option h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.format-option p {
  margin: 0;
  color: #718096;
  font-size: 14px;
}

.tag-container {
  margin-top: 8px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.recommended {
  background: #fed7d7;
  color: #c53030;
}

.editable {
  background: #bee3f8;
  color: #2b6cb0;
}

/* --- Filename Input --- */
.filename-input {
  margin-bottom: 24px;
}

.filename-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.filename-input input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.filename-input input:focus {
  outline: none;
  border-color: #667eea;
}

.filename-hint {
  margin: 8px 0 0;
  color: #718096;
  font-size: 12px;
}

/* --- ATS Info Section --- */
.ats-info {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.ats-info-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.ats-info-icon {
  fill: #48bb78;
  margin-right: 8px;
  flex-shrink: 0;
}

.ats-info-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.ats-info-text {
  margin: 0;
  color: #718096;
  font-size: 12px;
  line-height: 1.4;
}

/* --- Modal Actions --- */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-grow: 1;
  text-align: center;
}

.cancel-btn {
  border: 2px solid #e2e8f0;
  background: white;
  color: #718096;
}

.cancel-btn:hover {
  background: #f7fafc;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.download-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.download-btn:hover:not(.disabled) {
  opacity: 0.9;
}

.download-btn .loading-spinner {
  fill: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

/* --- Animations --- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animation class for JS */
.download-modal-overlay.fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}

/* --- Responsive Design --- */
@media (max-width: 576px) {
  .download-modal {
    padding: 24px;
    width: 95%;
  }
  
  .modal-close-btn {
    top: 10px;
    right: 10px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .modal-header p {
    font-size: 14px;
  }

  .format-option {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .format-icon {
    margin: 0 0 12px 0;
    width: 40px;
    height: 40px;
  }

  .format-option h3 {
    font-size: 16px;
  }

  .format-option p {
    font-size: 12px;
  }

  .tag-container {
    margin-top: 6px;
  }

  .filename-input label {
    font-size: 12px;
  }

  .filename-input input {
    padding: 10px 12px;
    font-size: 14px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn {
    padding: 10px;
    font-size: 14px;
  }

  .cancel-btn, .download-btn {
    flex-grow: 1;
  }
}
`;

// Helper functions for parsing and generating documents
function parseResumeContent(resumeText) {
  const sections = {};
  const lines = resumeText.split('\n').filter(line => line.trim());
  const sectionHeaders = [
    'professional summary', 'summary', 'objective', 'experience', 'work experience', 'employment history',
    'education', 'academic background', 'skills', 'technical skills', 'core competencies',
    'projects', 'key projects', 'notable projects', 'certifications', 'certificates', 'licenses',
    'achievements', 'accomplishments', 'awards'
  ];
  let currentSection = 'header';
  let currentContent = [];
  lines.forEach(line => {
    const lowerLine = line.toLowerCase().trim();
    const isHeader = sectionHeaders.some(header => lowerLine === header || (lowerLine.includes(header) && lowerLine.length < header.length + 10));
    if (isHeader) {
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = lowerLine.replace(/[^a-z\s]/g, '').replace(/\s+/g, '_');
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  });
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }
  return sections;
}



async function generatePDF(resumeText, filename, resumeElement) {
  try {
    if (!resumeElement) {
      throw new Error("Resume element not found for PDF generation.");
    }
    
    // Configure html2pdf options for high quality ATS friendly PDF
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use html2pdf to generate and save the PDF directly from the DOM node
    await html2pdf().set(opt).from(resumeElement).save();
    
    return { success: true, message: 'PDF downloaded successfully' };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
}

async function generateWord(resumeText, filename) {
  try {
    const config = ATS_CONFIG.word;
    const sections = parseResumeContent(resumeText);
    const children = [];
    const sectionOrder = [
      'header', 'professional_summary', 'summary', 'objective', 'experience', 'work_experience',
      'employment_history', 'education', 'academic_background', 'skills', 'technical_skills',
      'core_competencies', 'projects', 'key_projects', 'notable_projects', 'certifications',
      'certificates', 'licenses', 'achievements', 'accomplishments', 'awards'
    ];
    sectionOrder.forEach(sectionKey => {
      if (sections[sectionKey]) {
        const content = sections[sectionKey];
        if (sectionKey === 'header') {
          const headerLines = content.split('\n').filter(line => line.trim());
          if (headerLines.length > 0) {
            children.push(new Paragraph({
              children: [new TextRun({ text: headerLines[0], bold: true, size: config.fontSize.name })],
              alignment: AlignmentType.CENTER,
              spacing: { after: config.spacing.after }
            }));
            headerLines.slice(1).forEach(line => children.push(new Paragraph({
              children: [new TextRun({ text: line, size: config.fontSize.body })],
              alignment: AlignmentType.CENTER,
              spacing: { after: config.spacing.after / 2 }
            })));
          }
        } else {
          const sectionTitle = sectionKey.replace(/_/g, ' ').toUpperCase();
          children.push(new Paragraph({
            children: [new TextRun({ text: sectionTitle, bold: true, underline: { type: UnderlineType.SINGLE }, size: config.fontSize.heading })],
            spacing: { before: config.spacing.before * 2, after: config.spacing.after }
          }));
          const contentLines = content.split('\n').filter(line => line.trim());
          contentLines.forEach(line => children.push(new Paragraph({
            children: [new TextRun({ text: line, size: config.fontSize.body })],
            spacing: { after: config.spacing.after }
          })));
        }
        children.push(new Paragraph({
          children: [new TextRun({ text: '' })],
          spacing: { after: config.spacing.after }
        }));
      }
    });
    Object.keys(sections).forEach(sectionKey => {
      if (!sectionOrder.includes(sectionKey) && sections[sectionKey]) {
        const sectionTitle = sectionKey.replace(/_/g, ' ').toUpperCase();
        children.push(new Paragraph({
          children: [new TextRun({ text: sectionTitle, bold: true, underline: { type: UnderlineType.SINGLE }, size: config.fontSize.heading })],
          spacing: { before: config.spacing.before * 2, after: config.spacing.after }
        }));
        const contentLines = sections[sectionKey].split('\n').filter(line => line.trim());
        contentLines.forEach(line => children.push(new Paragraph({
          children: [new TextRun({ text: line, size: config.fontSize.body })],
          spacing: { after: config.spacing.after }
        })));
      }
    });
    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children: children
      }]
    });
    const buffer = await Packer.toBlob(doc);
    const url = URL.createObjectURL(buffer);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true, message: 'Word document downloaded successfully' };
  } catch (error) {
    console.error('Word generation error:', error);
    return { success: false, error: error.message };
  }
}

// React Component for the Download Modal
export function DownloadModal({ resumeText, resumeElement, onClose, onSuccess, onError }) {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [filename, setFilename] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Add the CSS to the document head
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.id = 'download-modal-styles';
    styleTag.textContent = modalStyles;
    document.head.appendChild(styleTag);

    return () => {
      // Clean up the style tag when the component unmounts
      const tagToRemove = document.getElementById('download-modal-styles');
      if (tagToRemove) {
        document.head.removeChild(tagToRemove);
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!selectedFormat) return;

    setIsGenerating(true);
    const fullFilename = filename ? `${filename}.${selectedFormat}` : `resume.${selectedFormat}`;
    
    try {
      let result;
      if (selectedFormat === 'pdf') {
        result = await generatePDF(resumeText, fullFilename, resumeElement);
      } else {
        result = await generateWord(resumeText, fullFilename);
      }
      
      if (result.success) {
        onSuccess(result.message);
        onClose();
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="download-modal-overlay">
      <div className="download-modal">
        {/* New close button */}
        <button className="modal-close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-icon-container">
            <svg className="modal-icon" width="28" height="28" viewBox="0 0 24 24">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h2>Download Your Resume</h2>
          <p>Choose your preferred format for optimal ATS compatibility</p>
        </div>
        
        <div className="format-options">
          <button 
            className={`format-option pdf-option ${selectedFormat === 'pdf' ? 'selected' : ''}`}
            data-format="pdf"
            onClick={() => setSelectedFormat('pdf')}
          >
            <div className="format-icon pdf-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <div>
              <h3>PDF Format</h3>
              <p>Universal compatibility, professional appearance</p>
              <div className="tag-container">
                <span className="tag recommended">Recommended</span>
              </div>
            </div>
          </button>
          
          <button 
            className={`format-option word-option ${selectedFormat === 'docx' ? 'selected' : ''}`}
            data-format="docx"
            onClick={() => setSelectedFormat('docx')}
          >
            <div className="format-icon word-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z"/>
              </svg>
            </div>
            <div>
              <h3>Word Document</h3>
              <p>Easy to edit, ATS-optimized formatting</p>
              <div className="tag-container">
                <span className="tag editable">Editable</span>
              </div>
            </div>
          </button>
        </div>
        
        <div className="filename-input">
          <label htmlFor="filename-input">Filename (optional)</label>
          <input 
            type="text" 
            id="filename-input" 
            placeholder="my-resume" 
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
          <p className="filename-hint">File extension will be added automatically</p>
        </div>
        
        <div className="ats-info">
          <div className="ats-info-header">
            <svg className="ats-info-icon" width="20" height="20" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <h4>ATS Optimized</h4>
          </div>
          <p className="ats-info-text">
            Both formats are optimized for Applicant Tracking Systems with proper fonts, spacing, and structure for maximum compatibility.
          </p>
        </div>
        
        <div className="modal-actions">
          <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className={`btn download-btn ${!selectedFormat || isGenerating ? 'disabled' : ''}`}
            disabled={!selectedFormat || isGenerating}
            onClick={handleDownload}
          >
            {isGenerating ? (
              <>
                <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                  <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
                </svg>
                Generating...
              </>
            ) : (
              'Download Resume'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}