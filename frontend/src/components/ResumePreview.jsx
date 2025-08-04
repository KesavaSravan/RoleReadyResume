import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ResumePreview.css';

export const ResumePreview = forwardRef(({ content }, ref) => {
  if (!content) return null;

  return (
    <div className="resume-preview-wrapper">
      <div className="resume-preview-page a4-format" ref={ref} id="resume-preview-content">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="resume-name" {...props} />,
            h2: ({node, ...props}) => <h2 className="resume-section-title" {...props} />,
            h3: ({node, ...props}) => <h3 className="resume-subsection-title" {...props} />,
            p: ({node, ...props}) => <p className="resume-text-block" {...props} />,
            ul: ({node, ...props}) => <ul className="resume-list" {...props} />,
            li: ({node, ...props}) => <li className="resume-list-item" {...props} />,
            strong: ({node, ...props}) => <strong className="resume-bold" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
