'use client';

import { Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Report</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Download statistical summary report (aggregate data only)
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { title: 'ReportการUseงาน Token รายmonth', desc: 'SummaryยอดAllocate ยอดUseจริง AndUsage Rateงาน', icon: '📊' },
          { title: 'ReportActivityยอดนิยม', desc: 'SummaryCategoryActivityAtReceivedความนิยมHighสุด', icon: '🏆' },
          { title: 'ReportParticipation by Department', desc: 'SummaryRateการเข้าร่วมActivityแยกbyDepartment', icon: '🏢' },
          { title: 'ReportPopular Time Slots', desc: 'Analyze peak usage hours by employees', icon: '⏰' },
          { title: 'Report ROI สวัสดิการ', desc: 'AnalyzeROI analysis of wellness benefit investment', icon: '💰' },
          { title: 'ReportQuarterly Trends', desc: 'SummaryTrendsการUseบริการเทียบรายไตรมาส', icon: '📈' },
        ].map((report) => (
          <div key={report.title} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)' }}>{report.icon}</div>
            <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{report.title}</h3>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-base)' }}>{report.desc}</p>
            <button style={{
              marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)',
              background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-brand)',
              fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
            }}>
              <Download size={14} /> Download CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
