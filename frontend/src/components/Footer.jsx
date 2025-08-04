import React from 'react';

export function Footer() {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="footer-title">Ready to Land Your Dream Job?</h3>
                <p className="footer-description">
                    Your optimized resume is now ready to make a powerful first impression.
                    Remember to customize it further for each specific application to maximize your success rate.
                </p>

                {/* Success Tips */}
                <div className="success-tips">
                    <div className="tip-card customize">
                        <div className="tip-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h4>Customize for Each Role</h4>
                        <p>Tailor your resume for every application to match specific job requirements and company culture.</p>
                    </div>

                    <div className="tip-card quality">
                        <div className="tip-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4>Quality Control</h4>
                        <p>Always proofread and verify all information before submitting your application.</p>
                    </div>

                    <div className="tip-card track">
                        <div className="tip-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h4>Track Performance</h4>
                        <p>Monitor your application success rate and refine your approach based on feedback.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bottom-footer">
                <p className="footer-info">
                    <span className="footer-brand">Professional Resume Optimization</span> •
                    Powered by Advanced AI Technology •
                    <span className="footer-secure">Secure & Private</span>
                </p>
                <div className="footer-legal">
                    <span>© 2025 </span>
                    <span>•</span>
                    <span>Enterprise-Grade Security</span>
                    <span>•</span>
                    <span>GDPR Compliant</span>
                </div>
            </div>
        </div>
    );
}
