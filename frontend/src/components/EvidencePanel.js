import React, { useState } from 'react';

const DIM_LABELS = {
  execution: 'Execution',
  systems_building: 'Systems Building',
  kpi_impact: 'KPI Impact',
  change_management: 'Change Mgmt',
  relationships: 'Relationships',
};

export default function EvidencePanel({ evidence = [], transcript = '' }) {
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'positive', 'negative', 'neutral'];
  const filtered = filter === 'all' ? evidence : evidence.filter(e => e.signal === filter);

  // Highlight a quote in the transcript context
  const [highlighted, setHighlighted] = useState(null);

  const highlightInTranscript = (quote) => {
    setHighlighted(highlighted === quote ? null : quote);
  };

  return (
    <div>
      <div className="panel-title">Extracted Evidence ({evidence.length} signals)</div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--accent-dim)' : 'none',
              border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
              color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
              padding: '4px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {f} {f === 'all' ? `(${evidence.length})` : `(${evidence.filter(e => e.signal === f).length})`}
          </button>
        ))}
      </div>

      <div className="evidence-list">
        {filtered.length === 0 && (
          <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No evidence in this category.</div>
        )}
        {filtered.map((ev, i) => (
          <div key={i} className="evidence-item">
            <div className="evidence-header">
              <div className={`signal-dot signal-${ev.signal || 'neutral'}`} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {ev.signal || 'neutral'}
              </span>
              <div className="evidence-dim-tag">{DIM_LABELS[ev.dimension] || ev.dimension || 'general'}</div>
              <button
                onClick={() => highlightInTranscript(ev.quote)}
                title="Locate in transcript"
                style={{
                  marginLeft: 'auto',
                  background: highlighted === ev.quote ? 'var(--accent-dim)' : 'none',
                  border: '1px solid var(--border)',
                  color: highlighted === ev.quote ? 'var(--accent)' : 'var(--text-dim)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '1px',
                }}
              >
                {highlighted === ev.quote ? 'SHOWN ▲' : 'LOCATE ↓'}
              </button>
            </div>
            <div className="evidence-body">
              <div className="evidence-quote">{ev.quote}</div>
              {ev.interpretation && (
                <div className="evidence-interp">{ev.interpretation}</div>
              )}
            </div>
            {highlighted === ev.quote && (
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '10px 12px',
                background: 'var(--bg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                lineHeight: '1.7',
                maxHeight: '150px',
                overflowY: 'auto',
              }}>
                <div style={{ color: 'var(--text-dim)', marginBottom: '6px', letterSpacing: '1px', fontSize: '0.62rem' }}>
                  TRANSCRIPT CONTEXT
                </div>
                {getContext(transcript, ev.quote)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getContext(transcript, quote) {
  if (!transcript || !quote) return transcript;
  const idx = transcript.toLowerCase().indexOf(quote.toLowerCase().slice(0, 20));
  if (idx === -1) return <span style={{ color: 'var(--text-dim)' }}>(Could not locate in transcript)</span>;
  const start = Math.max(0, idx - 80);
  const end = Math.min(transcript.length, idx + quote.length + 80);
  const before = transcript.slice(start, idx);
  const match = transcript.slice(idx, idx + quote.length);
  const after = transcript.slice(idx + quote.length, end);
  return (
    <span>
      {start > 0 && '…'}{before}
      <mark style={{ background: 'var(--accent-dim)', color: 'var(--accent)', padding: '1px 2px' }}>{match}</mark>
      {after}{end < transcript.length && '…'}
    </span>
  );
}
