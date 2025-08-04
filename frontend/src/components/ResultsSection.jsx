import { useState } from 'react';
import { ResumePreview } from './ResumePreview';

export function ResultsSection({ result, setResult, scoreData, countWords, handleCopy, handleDownload, resumeRef }) {
    const [isEditing, setIsEditing] = useState(false);
    const [refineInstruction, setRefineInstruction] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    const handleRefine = async () => {
        if (!refineInstruction.trim() || !result) return;
        setIsRefining(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/refine-resume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentResume: result,
                    instruction: refineInstruction
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to refine resume');
            }

            const data = await response.json();
            setResult(data.output);
            setRefineInstruction(''); // Clear input on success
        } catch (error) {
            console.error('Refine Error:', error);
            alert(error.message);
        } finally {
            setIsRefining(false);
        }
    };

    if (!result) return null;

    return (
        <div className="results-section">
            {/* Results Header */}
            <div className="results-header">
                <div className="results-info">
                    <div className="results-title">
                        <div className="results-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        Optimized Resume
                    </div>
                    <p className="results-description">
                        Your resume has been successfully tailored for the target position with enhanced keywords,
                        improved formatting, and ATS optimization.
                    </p>
                </div>
                <div className="results-actions">
                    <div className="results-stats">
                        <div className="stat-item">
                            <div className="stat-number">{countWords(result)}</div>
                            <div className="stat-label">Words</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{result.length}</div>
                            <div className="stat-label">Characters</div>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button onClick={() => setIsEditing(!isEditing)} className="action-button" style={{background: '#6366f1', color: 'white'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {isEditing ? 'Preview Match' : 'Edit Output'}
                        </button>
                        <button onClick={handleCopy} className="action-button copy-button">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Details
                        </button>
                        <button onClick={handleDownload} className="action-button download-button">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume Content */}
            <div className="results-content">
                {isEditing ? (
                    <div style={{padding: '1rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb'}}>
                        <textarea
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            style={{width: '100%', minHeight: '600px', padding: '1.5rem', fontSize: '14px', fontFamily: 'monospace', borderRadius: '0.25rem', border: '1px solid #d1d5db', resize: 'vertical'}}
                            placeholder="Edit your markdown resume here..."
                        />
                    </div>
                ) : (
                    <ResumePreview content={result} ref={resumeRef} />
                )}
            </div>

            {/* Interactive Refine Chat */}
            <div className="refine-chat-section" style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    AI Refinement
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>Ask the AI to tweak the current resume (e.g., "Make the summary shorter" or "Focus more on leadership").</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input 
                        type="text"
                        placeholder="Type an instruction to adjust the resume..."
                        value={refineInstruction}
                        onChange={(e) => setRefineInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }}
                        disabled={isRefining}
                    />
                    <button 
                        onClick={handleRefine}
                        disabled={isRefining || !refineInstruction.trim()}
                        className="action-button"
                        style={{ background: '#6366f1', color: 'white', border: 'none', opacity: (isRefining || !refineInstruction.trim()) ? 0.6 : 1 }}
                    >
                        {isRefining ? 'Updating...' : 'Apply Details'}
                    </button>
                </div>
            </div>

            {/* Action Items & Scores */}
            <div className="results-footer">
                <div className="optimization-info">
                    {scoreData && scoreData.missingKeywords && scoreData.missingKeywords.length > 0 && (
                        <div className="info-section">
                            <h3 className="info-title" style={{ color: '#dc2626' }}>
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Missing Keywords to Add
                            </h3>
                            <ul className="optimization-list" style={{ color: '#7f1d1d' }}>
                                {scoreData.missingKeywords.map((kw, i) => (
                                    <li key={i}>{kw}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="info-section">
                        <h3 className="info-title">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Next Steps
                        </h3>
                        <ul className="next-steps-list">
                            <li>Use the AI Refinement chat above to add any missing keywords</li>
                            <li>Review and personalize the generated content</li>
                            <li>Proofread for accuracy and consistency</li>
                            <li>Export to PDF format for applications</li>
                        </ul>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="performance-metrics">
                    <div className="metric-item">
                        <div className={`metric-value ${scoreData ? (scoreData.score >= 80 ? 'green' : scoreData.score >= 60 ? 'blue' : 'purple') : 'indigo'}`}>
                            {scoreData ? `${scoreData.score}%` : '...'}
                        </div>
                        <div className="metric-label">ATS Match Score</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
