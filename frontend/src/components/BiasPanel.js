import React from 'react';

const BIAS_TYPES = [
  { key: 'helpfulness', label: 'Helpfulness Bias', desc: '"She handles all my calls now" — sounds like 8, but may be 5-6 (task absorption)' },
  { key: 'presence', label: 'Presence Bias', desc: '"He\'s always on the floor" — rewarded for visibility, not systems' },
  { key: 'halo', label: 'Halo/Horn Effect', desc: 'One big story (positive or negative) coloring the whole assessment' },
  { key: 'recency', label: 'Recency Bias', desc: 'Supervisor remembers last 2 weeks, not the full tenure' },
  { key: 'dependency', label: 'Dependency Trap', desc: '"I don\'t know how we managed without them" — workload absorption, not systems' },
];

export default function BiasPanel({ biases = [] }) {
  return (
    <div>
      <div className="panel-title">Detected Supervisor Biases</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Supervisors are honest but biased. These patterns may be inflating or deflating the apparent score.
      </div>

      {biases.length === 0 ? (
        <div className="no-bias">✓ No strong biases detected in this transcript.</div>
      ) : (
        <div className="bias-list">
          {biases.map((b, i) => (
            <div key={i} className="bias-item">
              <span className="bias-icon">⚑</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bias-explainer" style={{ marginTop: '1.5rem' }}>
        <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Known Bias Patterns</strong>
        {BIAS_TYPES.map(bt => (
          <div key={bt.key} style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--yellow)', fontWeight: 500 }}>{bt.label}:</span>{' '}
            {bt.desc}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '12px',
        background: 'var(--surface2)',
        borderRadius: '4px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        borderLeft: '3px solid var(--yellow)',
      }}>
        ✎ Bias detection is the hardest task for an LLM. Treat detected biases as hypotheses, not facts. The intern should validate them against the transcript.
      </div>
    </div>
  );
}
