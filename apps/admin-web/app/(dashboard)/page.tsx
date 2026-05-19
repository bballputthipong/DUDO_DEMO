'use client';

import { Users, Building2, Coins, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

const MOCK = {
  totalUsers: 3842,
  totalPartners: 156,
  totalBookings: 28450,
  totalTokensCirculating: 185000,
  monthlyActive: 2104,
  pendingApprovals: 12,
  recentAlerts: [
    { id: 1, type: 'PARTNER', message: 'PartnersNewPending Approvals: Zen Yoga Studio', time: '5 min ago' },
    { id: 2, type: 'SECURITY', message: 'Failed login attempts > 5 from IP 103.xx.xx.xx', time: '12 min ago' },
    { id: 3, type: 'TOKEN', message: 'Token batch allocation completed for XYZ Corp', time: '1 hrs ago' },
    { id: 4, type: 'PARTNER', message: 'PartnersNewPending Approvals: Boxing Gym BKK', time: '2 hrs ago' },
  ],
};

const ALERT_COLORS: Record<string, string> = {
  PARTNER: 'var(--color-navy-600)',
  SECURITY: '#dc2626',
  TOKEN: 'var(--color-accent-600)',
};

export default function AdminDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Admin Console</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Platform-wide metrics & alerts
        </p>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        {[
          { label: 'Total Users', value: MOCK.totalUsers.toLocaleString(), icon: <Users size={22} />, bg: 'var(--bg-navy-subtle)', fg: 'var(--color-navy-700)' },
          { label: 'Partners', value: MOCK.totalPartners.toLocaleString(), icon: <Building2 size={22} />, bg: 'var(--bg-accent-subtle)', fg: 'var(--color-accent-600)' },
          { label: 'Circulating Tokens', value: MOCK.totalTokensCirculating.toLocaleString(), icon: <Coins size={22} />, bg: '#dcfce7', fg: '#16a34a' },
          { label: 'Total Bookings', value: MOCK.totalBookings.toLocaleString(), icon: <Activity size={22} />, bg: '#f3e8ff', fg: '#7c3aed' },
          { label: 'MAU (Monthly Active)', value: MOCK.monthlyActive.toLocaleString(), icon: <TrendingUp size={22} />, bg: '#e0f2fe', fg: '#0284c7' },
          { label: 'Pending Approvals', value: String(MOCK.pendingApprovals), icon: <AlertTriangle size={22} />, bg: '#fee2e2', fg: '#dc2626' },
        ].map((kpi) => (
          <div key={kpi.label} className="dashboard-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: kpi.bg, color: kpi.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{kpi.label}</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="dashboard-card">
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>🔔 Recent Alerts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {MOCK.recentAlerts.map((alert) => (
            <div key={alert.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--bg-app)', borderRadius: 'var(--radius-md)',
              borderLeft: `3px solid ${ALERT_COLORS[alert.type] || 'var(--border-default)'}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-heading)', fontWeight: 'var(--font-weight-medium)' }}>
                  {alert.message}
                </div>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
