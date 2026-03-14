import React, { useRef, useState } from 'react';

export function InputSection({
    resumeText, setResumeText,
    jobDescription, setJobDescription,
    countWords
}) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.type !== 'application/pdf' &&
            file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
            file.type !== 'application/msword') {
            alert('Please upload a valid PDF or DOCX file.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('resumeFile', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload-resume`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to upload document');
            }

            const data = await response.json();
            setResumeText(data.text);

            // Clear input so same file can be uploaded again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error('File Upload Error:', error);
            alert(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="input-section">
            {/* Resume Input */}
            <div className="input-card">
                <div className="card-header">
                    <div className="card-info">
                        <div className="card-title">
                            <div className="card-icon resume-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            Current Resume
                        </div>
                        <p className="card-subtitle">Upload or paste your existing resume</p>
                    </div>
                    <div className="word-counter">
                        <span className="word-count resume-count">
                            {countWords(resumeText)} words
                        </span>
                        <div className="char-count">
                            {resumeText.length} characters
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="action-button"
                            style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' }}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {isUploading ? 'Extracting Text...' : 'Upload PDF/Word'}
                        </button>
                    </div>
                    <textarea
                        className="input-textarea"
                        placeholder="Paste your current resume content here...

Essential sections to include:
✓ Contact Information & Professional Summary
✓ Work Experience with quantifiable achievements 
✓ Technical & Soft Skills
✓ Education & Certifications
✓ Notable Projects & Accomplishments

Pro tip: Include metrics and numbers wherever possible for maximum impact."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        style={{ height: '21rem' }}
                    />
                </div>
            </div>

            {/* Job Description Input */}
            <div className="input-card">
                <div className="card-header">
                    <div className="card-info">
                        <div className="card-title">
                            <div className="card-icon job-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                                </svg>
                            </div>
                            Target Position
                        </div>
                        <p className="card-subtitle">Job description to optimize for</p>
                    </div>
                    <div className="word-counter">
                        <span className="word-count job-count">
                            {countWords(jobDescription)} words
                        </span>
                        <div className="char-count">
                            {jobDescription.length} characters
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <textarea
                        className="input-textarea"
                        placeholder="Paste the complete job description here...

Key elements to include:
✓ Job Title & Company Information
✓ Required Qualifications & Experience
✓ Preferred Skills & Technologies
✓ Key Responsibilities & Duties  
✓ Company Culture & Values
✓ Benefits & Growth Opportunities

The more detailed the description, the better the AI can tailor your resume."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
