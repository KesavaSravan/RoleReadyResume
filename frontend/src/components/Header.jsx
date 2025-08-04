import React from 'react';

export function Header({ serverStatus }) {
    return (
        <div className="header">
            <div className="header-badge">
                <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AI-Powered Career Enhancement
            </div>
            <h1 className="main-title">
                Tailor Your Resume with
                <span className="title-gradient"> Precision</span>
            </h1>
            <p className="main-description">
                Transform your resume to perfectly align with any job description using advanced AI technology.
                Optimize for Applicant Tracking Systems and increase your interview callback rate by up to 300%.
            </p>
            <div className="features-list">
                <div className="feature-item">
                    <svg className="feature-check" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ATS Optimized
                </div>
                <div className="feature-item">
                    <svg className="feature-check" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Keyword Enhanced
                </div>
                <div className="feature-item">
                    <svg className="feature-check" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Industry Focused
                </div>
                <div className="feature-item">
                    <div className={`server-status-indicator ${serverStatus}`}>
                        <div className="status-dot"></div>
                        <span>
                            {serverStatus === 'online' && 'AI Server Online'}
                            {serverStatus === 'offline' && 'AI Server Offline'}
                            {serverStatus === 'checking' && 'Checking Server...'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
