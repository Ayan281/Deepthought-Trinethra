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
  const [highlighted, setHighlighted] = useState(null);

  const highlightInTranscript = (quote) => {
    setHighlighted(highlighted === quote ? null : quote);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>Extracted Evidence ({evidence.length})</div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '100px', border: '1px solid var(--border-glass)' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                color: filter === f ? 'var(--text-main)' : 'var(--text-dim)',
                padding: '6px 16px',
                borderRadius: '100px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'all 0.3s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="evidence-list">
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)', fontStyle: 'italic', border: '1px dashed var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
            No evidence vectors found for this filter.
          </div>
        )}
        {filtered.map((ev, i) => (
          <div key={i} className="evidence-item">
            <div className="evidence-header">
              <div className={`signal-dot signal-${ev.signal || 'neutral'}`} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                {ev.signal || 'neutral'}
              </span>
              <div className="evidence-dim-tag">{DIM_LABELS[ev.dimension] || ev.dimension || 'general'}</div>
              <button
                onClick={() => highlightInTranscript(ev.quote)}
                style={{
                  marginLeft: 'auto',
                  background: highlighted === ev.quote ? 'var(--text-main)' : 'transparent',
                  border: `1px solid ${highlighted === ev.quote ? 'var(--text-main)' : 'var(--border-glass)'}`,
                  color: highlighted === ev.quote ? '#000' : 'var(--text-muted)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s'
                }}
              >
                {highlighted === ev.quote ? 'Hide Context' : 'Locate Context'}
              </button>
            </div>
            <div className="evidence-body">
              <div className="evidence-quote">"{ev.quote}"</div>
              {ev.interpretation && (
                <div className="evidence-interp">
                  <strong style={{ color: 'var(--text-main)' }}>AI Synthesis: </strong>{ev.interpretation}
                </div>
              )}
            </div>
            
            {highlighted === ev.quote && (
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '1.5rem',
                background: '#020202',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                maxHeight: '250px',
                overflowY: 'auto',
              }}>
                <div style={{ color: 'var(--accent-glow-alt)', marginBottom: '1rem', letterSpacing: '2px', fontSize: '0.7rem' }}>
                   RAW_TRANSCRIPT_CONTEXT
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
  if (idx === -1) return <span style={{ color: 'var(--text-dim)' }}>(Could not locate exact match in source matrix)</span>;
  const start = Math.max(0, idx - 120);
  const end = Math.min(transcript.length, idx + quote.length + 120);
  const before = transcript.slice(start, idx);
  const match = transcript.slice(idx, idx + quote.length);
  const after = transcript.slice(idx + quote.length, end);
  return (
    <span>
      {start > 0 && '...'}{before}
      <mark style={{ background: 'rgba(0, 229, 255, 0.2)', color: '#fff', padding: '2px 4px', borderRadius: '2px' }}>{match}</mark>
      {after}{end < transcript.length && '...'}
    </span>
  );
}