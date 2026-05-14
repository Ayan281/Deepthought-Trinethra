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
      <div className="panel-title">Analytical Gaps ({gaps.length} Detected)</div>
      <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The following dimensions are structurally absent from the transcript. Utilize targeted inquiries to extract this data.
      </div>

      {gaps.length === 0 ? (
        <div style={{ padding: '2rem', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--accent-glow-alt)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          ✓ COMPREHENSIVE COVERAGE. All core assessment dimensions are present.
        </div>
      ) : (
        <div className="gaps-list">
          {gaps.map((g, i) => {
            const info = DIM_INFO[g.dimension] || { label: g.dimension, hint: '' };
            return (
              <div key={i} className="gap-item">
                <div className="gap-dim">⚠ {info.label}</div>
                <div className="gap-detail">{g.detail}</div>
                {info.hint && (
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--accent-glow)', 
                    marginTop: '1rem', 
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(255, 94, 0, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '4px'
                  }}>
                    <strong>INQUIRY VECTOR //</strong> {info.hint}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        marginTop: '3rem',
        border: '1px solid var(--border-glass)',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
      }}>
        <div className="panel-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>The Survivability Diagnostic</div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          The ultimate test of impact: <em style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>"If the Fellow disappeared tomorrow, would the systems they built survive?"</em>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--accent-glow-alt)' }}>YES → Systems Building (Layer 2)</span>
            <span style={{ color: 'var(--accent-glow)' }}>NO → Task Execution Only (Layer 1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}