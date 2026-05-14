import React from 'react';

const BIAS_TYPES = [
  { key: 'helpfulness', label: 'Helpfulness Bias', desc: '"She handles all my calls now" — sounds like 8, but may be 5-6 (task absorption)' },
  { key: 'presence', label: 'Presence Bias', desc: '"He\'s always on the floor" — rewarded for visibility, not system creation' },
  { key: 'halo', label: 'Halo/Horn Effect', desc: 'One isolated major event coloring the entirety of the assessment' },
  { key: 'recency', label: 'Recency Bias', desc: 'Supervisor exclusively evaluating the last 2 weeks rather than full tenure' },
  { key: 'dependency', label: 'Dependency Trap', desc: '"I don\'t know how we managed without them" — workload absorption, not systems' },
];

export default function BiasPanel({ biases = [] }) {
  return (
    <div>
      <div className="panel-title">Cognitive Bias Detection</div>
      <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Human supervisors are inherently subjective. The engine flags potential psychological patterns inflating or deflating the score.
      </div>

      {biases.length === 0 ? (
        <div style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-dim)' }}>
          ✓ NO SIGNIFICANT SUPERVISORY BIASES DETECTED IN THIS VECTOR.
        </div>
      ) : (
        <div className="bias-list">
          {biases.map((b, i) => (
            <div key={i} className="bias-item">
              <span className="bias-icon">⚑</span>
              <span style={{ color: 'var(--text-main)' }}>{b}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1rem' }}>Known Bias Parameters</h3>
        <div className="bias-explainer-grid">
          {BIAS_TYPES.map(bt => (
            <div key={bt.key} className="bias-explainer-card">
              <div style={{ color: 'var(--accent-glow)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                {bt.label}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {bt.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        background: 'rgba(255, 94, 0, 0.05)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        borderLeft: '4px solid var(--accent-glow)',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.6
      }}>
        <strong style={{ color: 'var(--accent-glow)' }}>CRITICAL SYSTEM NOTE //</strong> Bias detection remains highly complex for LLM interpretation. Treat flagged items as probabilistic hypotheses requiring human-in-the-loop validation, rather than absolute facts.
      </div>
    </div>
  );
}