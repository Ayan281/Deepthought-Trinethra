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
      <div className="panel-title">KPI Mapping ({kpiMapping.length} connected)</div>

      {kpiMapping.length === 0 ? (
        <div className="kpi-empty">
          No KPI connections identified. This is a significant gap — the Fellow's work is not visibly tied to business outcomes.
        </div>
      ) : (
        <>
          <div className="kpi-list">
            {kpiMapping.map((k, i) => (
              <div key={i} className="kpi-item">
                <div className="kpi-header">
                  <div className="kpi-name">{k.kpi}</div>
                  <div className={`kpi-type ${k.systemOrPersonal === 'system' ? 'kpi-system' : 'kpi-personal'}`}>
                    {k.systemOrPersonal === 'system' ? '◈ System' : '◎ Personal'}
                  </div>
                </div>
                <div className="kpi-evidence">{k.evidence}</div>
                {KPI_DESCRIPTIONS[k.kpi] && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px', fontStyle: 'italic' }}>
                    {KPI_DESCRIPTIONS[k.kpi]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '10px 14px',
            background: 'var(--surface2)',
            borderRadius: '4px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>◈ System</strong> = self-sustaining (continues if Fellow leaves) &nbsp;|&nbsp;
            <strong style={{ color: 'var(--text)' }}>◎ Personal</strong> = depends on Fellow's presence
          </div>
        </>
      )}
    </div>
  );
}
