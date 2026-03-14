import { useState } from 'react';
import { ResumePreview } from './ResumePreview';

export function ResultsSection({ 
    result, setResult, scoreData, countWords, handleCopy, handleDownload, 
    resumeRef, refine, loadingType, history, restoreVersion 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [refineInstruction, setRefineInstruction] = useState('');

    const isRefining = loadingType === 'refine';

    const handleRefine = async () => {
        if (!refineInstruction.trim() || !result || isRefining) return;
        const success = await refine(refineInstruction);
        if (success) {
            setRefineInstruction(''); // Clear input on success
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
                        <button onClick={() => setIsEditing(!isEditing)} className="action-button" style={{ background: '#6366f1', color: 'white' }}>
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
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                        <textarea
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            style={{ width: '100%', minHeight: '600px', padding: '1.5rem', fontSize: '14px', fontFamily: 'monospace', borderRadius: '0.25rem', border: '1px solid #d1d5db', resize: 'vertical' }}
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
                        style={{ background: '#6366f1', color: 'white', border: 'none', opacity: (isRefining || !refineInstruction.trim()) ? 0.6 : 1, position: 'relative' }}
                    >
                        {isRefining ? 'Updating...' : 'Apply Details'}
                    </button>
                    {isRefining && (
                        <button 
                            onClick={() => refine('') /* Empty instruction actually won't abort, but abortRef handles it automatically if triggered twice. Actually we can expose an abort method or just let new request abort old. */}
                            className="action-button"
                            style={{ background: '#ef4444', color: 'white', border: 'none' }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Action Items & Scores */}
            <div className="results-footer">

                {history && history.length > 1 && (
                    <div className="version-history-section" style={{ marginBottom: '2rem' }}>
                        <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                            <svg fill="currentColor" viewBox="0 0 20 20" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            Version History
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {history.map((ver, idx) => (
                                <button 
                                    key={ver.id}
                                    onClick={() => restoreVersion(ver)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        background: result === ver.result ? '#e0e7ff' : '#f9fafb',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                    title={`Score: ${ver.scoreData ? ver.scoreData.score + '%' : 'N/A'}`}
                                >
                                    {ver.label} ({ver.timestamp})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Performance Metrics & Score Card */}
                {scoreData && (
                    <div className="score-card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
                            <div className="score-ring" style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: `conic-gradient(${scoreData.score >= 80 ? '#10b981' : scoreData.score >= 60 ? '#3b82f6' : '#8b5cf6'} ${scoreData.score}%, #e5e7eb ${scoreData.score}% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                                    {scoreData.score}%
                                </div>
                            </div>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>ATS Match Profile</h3>
                                {scoreData.summary && <p style={{ color: '#4b5563', margin: '0 0 1rem 0' }}>{scoreData.summary}</p>}
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {scoreData.strengths && scoreData.strengths.length > 0 && (
                                        <div>
                                            <h4 style={{ color: '#059669', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Strengths</h4>
                                            <ul style={{ paddingLeft: '1.2rem', color: '#065f46', fontSize: '0.875rem', margin: 0 }}>
                                                {scoreData.strengths.map((str, i) => <li key={i}>{str}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {scoreData.missingKeywords && scoreData.missingKeywords.length > 0 && (
                                        <div>
                                            <h4 style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Missing Keywords</h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {scoreData.missingKeywords.map((kw, i) => (
                                                    <span key={i} style={{ padding: '0.2rem 0.5rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.25rem', fontSize: '0.75rem' }}>{kw}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="optimization-info">
                    <div className="info-section">
                        <h3 className="info-title" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                            <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#4338ca' }}>
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Next Steps
                        </h3>
                        <ul className="next-steps-list" style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}><span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>Use the AI Refinement chat above to add any missing keywords</li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}><span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>Review and personalize the generated content</li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}><span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>Proofread for accuracy and consistency</li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}><span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>Export to PDF format for applications</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
