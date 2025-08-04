import React from 'react';

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-content">
                    <div className="brand">
                        <div className="brand-logo">
                            <span>AI</span>
                        </div>
                        <span className="brand-name">ResumeAI</span>
                    </div>
                    <div className="nav-tagline">
                        <span>Professional Resume Optimization</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
