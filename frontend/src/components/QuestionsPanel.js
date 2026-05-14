import React, { useState } from 'react';

export default function QuestionsPanel({ questions = [] }) {
  const [copied, setCopied] = useState(null);

  const copyAll = () => {
    const text = questions.map((q, i) => `Q${i+1}: ${q.question}\n(Looking for: ${q.lookingFor})`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>
          Follow-up Questions ({questions.length})
        </div>
        {questions.length > 0 && (
          <button
            onClick={copyAll}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: copied === 'all' ? 'var(--green)' : 'var(--text-muted)',
              padding: '4px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '1px',
            }}
          >
            {copied === 'all' ? '✓ COPIED' : 'COPY ALL'}
          </button>
        )}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        These questions target specific gaps. Use them in the next supervisor call.
      </div>

      <div className="questions-list">
        {questions.length === 0 && (
          <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No follow-up questions generated.</div>
        )}
        {questions.map((q, i) => (
          <div key={i} className="question-item">
            <div className="question-header">
              <span className="question-num">Q{i + 1}</span>
              {q.targetGap && (
                <span className="question-target">{q.targetGap.replace(/_/g, ' ')}</span>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(q.question);
                  setCopied(i);
                  setTimeout(() => setCopied(null), 1500);
                }}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: copied === i ? 'var(--green)' : 'var(--text-dim)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                }}
              >
                {copied === i ? '✓' : 'COPY'}
              </button>
            </div>
            <div className="question-body">
              <div className="question-text">{q.question}</div>
              {q.lookingFor && (
                <div className="question-looking">
                  <strong>Looking for: </strong>{q.lookingFor}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
