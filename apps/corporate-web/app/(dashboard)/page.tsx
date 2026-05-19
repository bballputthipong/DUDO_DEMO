'use client';

import {
  Users,
  Coins,
  TrendingUp,
  Activity,
  Building2,
  BarChart3,
} from 'lucide-react';

// Privacy-safe aggregate data only — no individual employee data (per AGENT.md)
const MOCK_DASHBOARD = {
  period: '2024-05-01/2024-05-31',
  totalEmployees: 248,
  activeEmployees: 186,
  tokenUtilizationRate: 72.4,
  totalTokensAllocated: 12400,
  totalTokensUsed: 8978,
  topCategories: [
    { category: 'yoga', bookingCount: 342, percentageOfTotal: 28.5 },
    { category: 'gym', bookingCount: 298, percentageOfTotal: 24.8 },
    { category: 'swimming', bookingCount: 187, percentageOfTotal: 15.6 },
    { category: 'boxing', bookingCount: 156, percentageOfTotal: 13.0 },
    { category: 'pilates', bookingCount: 124, percentageOfTotal: 10.3 },
    { category: 'spa', bookingCount: 93, percentageOfTotal: 7.8 },
  ],
  departmentBreakdown: [
    { departmentId: 'd1', departmentName: 'วิศวกรรม', activeRate: 82, topCategory: 'gym' },
    { departmentId: 'd2', departmentName: 'การตลาด', activeRate: 91, topCategory: 'yoga' },
    { departmentId: 'd3', departmentName: 'บัญชี', activeRate: 65, topCategory: 'swimming' },
    { departmentId: 'd4', departmentName: 'ทรัพยากรบุคคล', activeRate: 88, topCategory: 'pilates' },
    { departmentId: 'd5', departmentName: 'ฝ่ายขาย', activeRate: 71, topCategory: 'boxing' },
  ],
  popularTimeSlots: [
    { hour: 6, bookingCount: 45 },
    { hour: 7, bookingCount: 89 },
    { hour: 8, bookingCount: 67 },
    { hour: 12, bookingCount: 112 },
    { hour: 17, bookingCount: 156 },
    { hour: 18, bookingCount: 198 },
    { hour: 19, bookingCount: 167 },
    { hour: 20, bookingCount: 88 },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  yoga: '🧘 Yoga', gym: '🏋️ Fitness', swimming: '🏊 Swimming',
  boxing: '🥊 Boxing', pilates: '💪 พิลาทิส', spa: '💆 สปา',
  meditation: '🧠 Meditation', dance: '💃 เต้น',
};

export default function CorporateDashboardPage() {
  const d = MOCK_DASHBOARD;
  const participationRate = Math.round((d.activeEmployees / d.totalEmployees) * 100);
  const maxTimeSlot = Math.max(...d.popularTimeSlots.map((s) => s.bookingCount));

  return (
    <div className="corp-dashboard">
      <div className="corp-header">
        <div>
          <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>
            Wellness Dashboard
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            InfoTotalstatisticalmonthMay 2024 (aggregate data only)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-blue"><Users size={22} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Employee Participation</span>
            <span className="kpi-value">{d.activeEmployees}<span className="kpi-unit"> / {d.totalEmployees}</span></span>
            <span className="kpi-sub">{participationRate}% participation rate</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-amber"><Coins size={22} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Tokens Used</span>
            <span className="kpi-value">{d.totalTokensUsed.toLocaleString()}<span className="kpi-unit"> / {d.totalTokensAllocated.toLocaleString()}</span></span>
            <span className="kpi-sub">{d.tokenUtilizationRate.toFixed(1)}% utilization</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-green"><TrendingUp size={22} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Token Usage Rate</span>
            <span className="kpi-value">{d.tokenUtilizationRate.toFixed(1)}%</span>
            <span className="kpi-sub" style={{ color: '#16a34a' }}>↑ 8.2% vs monthBefore</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-purple"><Activity size={22} /></div>
          <div className="kpi-content">
            <span className="kpi-label">ActivitiesAll</span>
            <span className="kpi-value">{d.topCategories.reduce((a, c) => a + c.bookingCount, 0).toLocaleString()}</span>
            <span className="kpi-sub">times this month</span>
          </div>
        </div>
      </div>

      {/* Bottom sections */}
      <div className="corp-bottom">
        {/* Top Categories */}
        <div className="dashboard-card">
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>
            🏆 Trending Activities
          </h3>
          <div className="category-list">
            {d.topCategories.map((cat, i) => (
              <div key={cat.category} className="category-item">
                <div className="category-rank">#{i + 1}</div>
                <div className="category-info">
                  <span className="category-name">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                  <div className="category-bar-bg">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${cat.percentageOfTotal}%` }}
                    />
                  </div>
                </div>
                <div className="category-stats">
                  <span className="category-count">{cat.bookingCount}</span>
                  <span className="category-pct">{cat.percentageOfTotal.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department breakdown */}
        <div className="dashboard-card">
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>
            <Building2 size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Participation by Department
          </h3>
          <div className="dept-list">
            {d.departmentBreakdown.map((dept) => (
              <div key={dept.departmentId} className="dept-item">
                <div className="dept-info">
                  <span className="dept-name">{dept.departmentName}</span>
                  <span className="dept-top-cat">{CATEGORY_LABELS[dept.topCategory] || dept.topCategory}</span>
                </div>
                <div className="dept-rate">
                  <div className="dept-bar-bg">
                    <div
                      className="dept-bar-fill"
                      style={{
                        width: `${dept.activeRate}%`,
                        background: dept.activeRate > 80 ? '#16a34a' : dept.activeRate > 60 ? 'var(--color-accent-400)' : '#dc2626',
                      }}
                    />
                  </div>
                  <span className="dept-pct">{dept.activeRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Time Slots */}
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>
            <BarChart3 size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Popular Time Slots
          </h3>
          <div className="time-chart">
            {d.popularTimeSlots.map((slot) => (
              <div key={slot.hour} className="time-bar-wrapper">
                <span className="time-bar-value">{slot.bookingCount}</span>
                <div className="time-bar-container">
                  <div
                    className="time-bar"
                    style={{
                      height: `${(slot.bookingCount / maxTimeSlot) * 100}%`,
                      background: slot.bookingCount === maxTimeSlot
                        ? 'var(--color-accent-400)'
                        : 'var(--color-navy-600)',
                    }}
                  />
                </div>
                <span className="time-label">{String(slot.hour).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .corp-dashboard { display: flex; flex-direction: column; gap: var(--space-6); }

        .corp-header { display: flex; align-items: center; justify-content: space-between; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }

        .kpi-card {
          background: var(--bg-base); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
          padding: var(--space-5); display: flex; align-items: flex-start; gap: var(--space-4);
          transition: box-shadow var(--duration-fast) var(--ease-standard);
        }
        .kpi-card:hover { box-shadow: var(--shadow-md); }

        .kpi-icon {
          width: 48px; height: 48px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .kpi-icon-blue { background: var(--bg-navy-subtle); color: var(--color-navy-700); }
        .kpi-icon-amber { background: var(--bg-accent-subtle); color: var(--color-accent-600); }
        .kpi-icon-green { background: #dcfce7; color: #16a34a; }
        .kpi-icon-purple { background: #f3e8ff; color: #7c3aed; }

        .kpi-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .kpi-label { font-size: var(--font-size-sm); color: var(--text-secondary); }
        .kpi-value {
          font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);
          color: var(--text-heading); line-height: var(--line-height-tight);
        }
        .kpi-unit { font-size: var(--font-size-base); font-weight: var(--font-weight-normal); color: var(--text-tertiary); }
        .kpi-sub { font-size: var(--font-size-xs); color: var(--text-tertiary); }

        .corp-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }

        /* Categories */
        .category-list { display: flex; flex-direction: column; gap: var(--space-3); }
        .category-item { display: flex; align-items: center; gap: var(--space-3); }
        .category-rank {
          font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
          color: var(--text-tertiary); width: 24px; text-align: center;
        }
        .category-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .category-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
        .category-bar-bg {
          height: 6px; background: var(--bg-section); border-radius: 3px; overflow: hidden;
        }
        .category-bar-fill {
          height: 100%; background: var(--color-navy-600); border-radius: 3px;
          transition: width var(--duration-slow) var(--ease-decelerate);
        }
        .category-stats { text-align: right; }
        .category-count {
          font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
          color: var(--text-heading); display: block;
        }
        .category-pct { font-size: var(--font-size-xs); color: var(--text-tertiary); }

        /* Departments */
        .dept-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .dept-item { display: flex; align-items: center; gap: var(--space-4); }
        .dept-info { flex: 1; min-width: 0; }
        .dept-name {
          font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
          color: var(--text-heading); display: block;
        }
        .dept-top-cat { font-size: var(--font-size-xs); color: var(--text-tertiary); }
        .dept-rate { width: 160px; display: flex; align-items: center; gap: var(--space-2); }
        .dept-bar-bg {
          flex: 1; height: 8px; background: var(--bg-section); border-radius: 4px; overflow: hidden;
        }
        .dept-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width var(--duration-slow) var(--ease-decelerate);
        }
        .dept-pct {
          font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
          color: var(--text-heading); width: 40px; text-align: right;
        }

        /* Time chart */
        .time-chart {
          display: flex; align-items: flex-end; gap: var(--space-3);
          height: 160px; padding-top: var(--space-3);
        }
        .time-bar-wrapper {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: var(--space-1); height: 100%;
        }
        .time-bar-value {
          font-size: var(--font-size-2xs); font-weight: var(--font-weight-bold);
          color: var(--text-tertiary);
        }
        .time-bar-container { flex: 1; width: 100%; display: flex; align-items: flex-end; }
        .time-bar {
          width: 100%; border-radius: 4px 4px 0 0; min-height: 4px;
          transition: height var(--duration-slow) var(--ease-decelerate);
        }
        .time-label { font-size: 10px; color: var(--text-tertiary); font-weight: var(--font-weight-semibold); }

        @media (max-width: 1200px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: 1fr; }
          .corp-bottom { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
