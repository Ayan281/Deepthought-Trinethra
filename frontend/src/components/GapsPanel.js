import React from 'react';

const DIM_INFO = {
  execution: {
    label: 'Driving Execution',
    hint: 'Does the Fellow get things done on time, follow up without reminders, initiate work?'
  },
  systems_building: {
    label: 'Systems Building',
    hint: 'Did the Fellow create trackers, SOPs, templates, or structures others use independently?'
  },
  kpi_impact: {
    label: 'KPI Impact',
    hint: 'Is the Fellow\'s work connected to measurable business outcomes?'
  },
  change_management: {
    label: 'Change Management',
    hint: 'How does the Fellow handle resistance from experienced workers? Do people adopt their processes?'
  },
};

export default function GapsPanel({ gaps = [] }) {
  return (
    <div>
      <div className="panel-title">Assessment Gaps ({gaps.length} identified)</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        These dimensions are missing from the transcript. The intern should ask targeted follow-up questions to fill them.
      </div>

      {gaps.length === 0 ? (
        <div className="no-gaps">✓ All 4 assessment dimensions appear to be covered.</div>
      ) : (
        <div className="gaps-list">
          {gaps.map((g, i) => {
            const info = DIM_INFO[g.dimension] || { label: g.dimension, hint: '' };
            return (
              <div key={i} className="gap-item">
                <div className="gap-dim">⚠ {info.label}</div>
                <div className="gap-detail">{g.detail}</div>
                {info.hint && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: '6px', fontStyle: 'italic', opacity: 0.8 }}>
                    What to ask: {info.hint}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        marginTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        paddingTop: '1rem',
      }}>
        <div className="panel-title" style={{ marginBottom: '0.5rem' }}>Survivability Test</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          The simplest diagnostic: <em style={{ color: 'var(--text)' }}>"If the Fellow left tomorrow, would any system they built continue running?"</em>
          <br />YES → Systems Building (Layer 2) &nbsp;|&nbsp; NO → Task Execution only (Layer 1)
        </div>
      </div>
    </div>
  );
}
