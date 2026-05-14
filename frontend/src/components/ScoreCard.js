import React from 'react';

const BAND_COLOR = {
  'Need Attention': '#e05c5c',
  'Productivity': '#f5a623',
  'Performance': '#4caf7d',
};

export default function ScoreCard({ score }) {
  if (!score) return <div className="panel-title">No score data</div>;

  const { value, label, band, justification, confidence, layerAssessment } = score;
  const safeValue = Number(value) || 0;
  const fillPct = (safeValue / 10) * 100;
  const bandColor = BAND_COLOR[band] || '#f5a623';

  const confColor = { low: '#e05c5c', medium: '#f5a623', high: '#4caf7d' }[confidence] || '#8a8f9a';

  return (
    <div className="score-card">
      <div className="panel-title">Suggested Score</div>

      <div className="score-top">
        <div className="score-number" style={{ color: bandColor }}>{safeValue}</div>
        <div className="score-right">
          <div className="score-label">{label || '—'}</div>
          <div className="score-band">{band || '—'}</div>
          <div className="score-bar-wrap">
            <div className="score-bar">
              <div
                className="score-bar-fill"
                style={{
                  width: `${fillPct}%`,
                  backgroundPosition: `${100 - fillPct}% 0`
                }}
              />
            </div>
            <div className="score-ticks">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <span key={n} style={{ color: n === safeValue ? bandColor : undefined }}>{n}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="confidence-row">
        <div className="confidence-dot" style={{ background: confColor }} />
        AI confidence: <strong style={{ color: confColor }}>{confidence || 'unknown'}</strong>
        <span style={{ color: '#3a3d44', marginLeft: 'auto' }}>
          Score is a draft — intern must verify
        </span>
      </div>

      {justification && (
        <div>
          <div className="panel-title" style={{ marginBottom: '0.5rem' }}>Justification</div>
          <div className="score-justification">{justification}</div>
        </div>
      )}

      {layerAssessment && (
        <div className="score-layer">
          <strong>Layer Assessment: </strong>{layerAssessment}
        </div>
      )}
    </div>
  );
}
