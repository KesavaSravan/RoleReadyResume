export function GenerateSection({
  resumeText,
  jobDescription,
  serverStatus,
  loadingType,
  countWords,
  generate,
  checkServerStatus
}) {
  return (
    <div className="generate-section">
      <div className="generate-container">
        <button
          onClick={() => generate('tailor')}
          disabled={loadingType !== null || !resumeText || !jobDescription || serverStatus === 'offline'}
          className="generate-button"
        >
          <div className="button-background"></div>
          <div className="button-content">
            {loadingType === 'tailor' ? (
              <>
                <div className="loading-spinner"></div>
                <div className="loading-text">
                  <span>AI is Optimizing Your Resume</span>
                  <span className="loading-subtitle">Please wait while we enhance your resume...</span>
                </div>
              </>
            ) : (
              <>
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Optimized Resume
              </>
            )}
          </div>
        </button>

        <button
          onClick={() => generate('coverLetter')}
          disabled={loadingType !== null || !resumeText || !jobDescription || serverStatus === 'offline'}
          className="generate-button"
          style={{ background: '#4b5563', marginTop: '1rem' }}
        >
          <div className="button-content">
            {loadingType === 'coverLetter' ? (
              <>
                <div className="loading-spinner"></div>
                <div className="loading-text">
                  <span>Generating Cover Letter...</span>
                  <span className="loading-subtitle">Crafting a professional narrative...</span>
                </div>
              </>
            ) : (
              <>
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
                Generate Cover Letter
              </>
            )}
          </div>
        </button>

        {serverStatus === 'offline' && (
          <div className="error-message">
            <div className="error-content">
              <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="error-text">
                <span className="error-title">Backend Server Offline</span>
                <span className="error-subtitle">Please start the backend server on http://localhost:3001</span>
              </div>
              <button onClick={checkServerStatus} className="retry-button">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {(!resumeText && !jobDescription) && serverStatus === 'online' && (
          <div className="warning-message">
            <div className="warning-content">
              <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Please complete both fields to begin optimization</span>
            </div>
          </div>
        )}

        {(!resumeText && jobDescription) && serverStatus === 'online' && (
          <div className="warning-message">
            <div className="warning-content">
              <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Add your resume to continue</span>
            </div>
          </div>
        )}

        {(resumeText && !jobDescription) && serverStatus === 'online' && (
          <div className="warning-message">
            <div className="warning-content">
              <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Add a job description to continue</span>
            </div>
          </div>
        )}

        {(resumeText && jobDescription) && loadingType === null && (
          <div className="status-indicators">
            <div className="status-item">
              <div className="status-dot resume-dot"></div>
              Resume: {countWords(resumeText)} words
            </div>
            <div className="status-item">
              <div className="status-dot job-dot"></div>
              Job Description: {countWords(jobDescription)} words
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
