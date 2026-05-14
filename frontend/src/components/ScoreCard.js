import React from 'react';

const BAND_COLOR = {
  'Need Attention': '#ff4444',
  'Productivity': '#ff5e00', // Adjusted to match the orange glow theme
  'Performance': '#00e5ff',  // Adjusted to match the cyan glow theme
};

export default function ScoreCard({ score }) {
  if (!score) return <div className="panel-title">Data Unavailable</div>;

  const { value, label, band, justification, confidence, layerAssessment } = score;
  const safeValue = Number(value) || 0;
  const fillPct = (safeValue / 10) * 100;
  const bandColor = BAND_COLOR[band] || 'var(--accent-glow)';

  return (
    <div className="score-card">
      <div className="panel-title">Assessment Output</div>

      <div className="score-top">
        <div className="score-number" style={{ color: bandColor }}>{safeValue}</div>
        <div className="score-right">
          <div className="score-label">{label || '—'}</div>
          <div className="score-band">{band || '—'}</div>
          
          <div className="score-bar-wrap">
            <div className="score-bar-fill" style={{ width: `${fillPct}%`, color: bandColor, backgroundColor: bandColor }} />
          </div>
          
          <div className="score-ticks">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <span key={n} style={{ color: n === safeValue ? bandColor : 'inherit' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>AI Confidence Level: <strong style={{ color: '#fff', textTransform: 'uppercase' }}>{confidence || 'N/A'}</strong></span>
        <span>Status: Draft — Requires Human Verification</span>
      </div>

      {justification && (
        <div style={{ marginTop: '1rem' }}>
          <div className="section-label">Justification Matrix</div>
          <div className="score-justification">{justification}</div>
        </div>
      )}

      {layerAssessment && (
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)', marginTop: '1rem' }}>
          <strong style={{ color: 'var(--accent-glow-alt)', fontFamily: 'var(--font-mono)' }}>LAYER ASSESSMENT // </strong> 
          <span style={{ color: 'var(--text-main)' }}>{layerAssessment}</span>
        </div>
      )}
    </div>
  );
}