'use client';

import { UserCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';

const MOCK_APPROVALS = [
  { id: 'a1', type: 'PARTNER', entity: 'Zen Yoga Studio', description: 'New partner application — initial document verification passed', requestedAt: '2024-05-18T14:30:00Z' },
  { id: 'a2', type: 'PARTNER', entity: 'Boxing Gym BKK', description: 'New partner application', requestedAt: '2024-05-18T10:15:00Z' },
  { id: 'a3', type: 'OFFER', entity: 'Meditation Retreat', description: 'New offer from FitLife Studio — 15 Tokens (above average)', requestedAt: '2024-05-17T09:00:00Z' },
];

export default function ApprovalsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Approvals</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {MOCK_APPROVALS.length} items pending approval
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {MOCK_APPROVALS.map((item) => (
          <div key={item.id} className="dashboard-card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: item.type === 'PARTNER' ? 'var(--bg-navy-subtle)' : 'var(--bg-accent-subtle)',
              color: item.type === 'PARTNER' ? 'var(--color-navy-700)' : 'var(--color-accent-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <UserCheck size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span className={`status-badge ${item.type === 'PARTNER' ? 'status-pending' : 'status-checked-in'}`} style={{ fontSize: 10 }}>
                  {item.type}
                </span>
                <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>
                  {item.entity}
                </span>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: '0 0 var(--space-3) 0' }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                <Clock size={12} />
                {new Date(item.requestedAt).toLocaleString('th-TH')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
              <button style={{
                padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
                background: '#16a34a', color: 'white', border: 'none',
                fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
              }}>
                <CheckCircle2 size={14} /> Approve
              </button>
              <button style={{
                padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
                background: 'white', color: '#dc2626', border: '1px solid #fecaca',
                fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
              }}>
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
