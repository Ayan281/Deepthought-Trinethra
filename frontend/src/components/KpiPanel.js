import React from 'react';

const KPI_DESCRIPTIONS = {
  'Lead Generation': 'New customers identified/contacted',
  'Lead Conversion': 'Leads that became paying customers',
  'Upselling': 'Selling more to existing customers',
  'Cross-selling': 'Additional products to existing customers',
  'NPS': 'Customer satisfaction improvements',
  'PAT': 'Profitability — waste reduction, cost savings',
  'TAT': 'Turnaround time — faster dispatch, fewer missed deadlines',
  'Quality': 'Defect/rejection/complaint rate improvements',
};

export default function KpiPanel({ kpiMapping = [] }) {
  return (
    <div>
      <div className="panel-title">KPI Matrix ({kpiMapping.length} Mapped)</div>

      {kpiMapping.length === 0 ? (
        <div className="kpi-empty">
          ⚠ NO KPI CONNECTIONS IDENTIFIED.<br/>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'inline-block' }}>
            This is a significant critical gap. The Fellow's operational output is not visibly tethered to tangible business outcomes.
          </span>
        </div>
      ) : (
        <>
          <div className="kpi-list">
            {kpiMapping.map((k, i) => (
              <div key={i} className="kpi-item">
                <div className="kpi-header">
                  <div className="kpi-name">{k.kpi}</div>
                  <div className={`kpi-type ${k.systemOrPersonal === 'system' ? 'kpi-system' : 'kpi-personal'}`}>
                    {k.systemOrPersonal === 'system' ? '◈ System Level' : '◎ Personal Level'}
                  </div>
                </div>
                <div className="kpi-evidence">"{k.evidence}"</div>
                {KPI_DESCRIPTIONS[k.kpi] && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '1rem', fontStyle: 'italic', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
                    Metric Goal: {KPI_DESCRIPTIONS[k.kpi]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-glass)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <span style={{ color: 'var(--text-main)' }}><strong>LEGEND //</strong></span>
            <span><strong style={{ color: 'var(--accent-glow-alt)' }}>◈ System</strong> = Self-sustaining (Continues independently of the Fellow)</span>
            <span><strong style={{ color: 'var(--accent-glow)' }}>◎ Personal</strong> = Dependent (Requires Fellow's active presence)</span>
          </div>
        </>
      )}
    </div>
  );
}