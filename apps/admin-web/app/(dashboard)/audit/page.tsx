'use client';

// lucide icons available for future use

const MOCK_AUDIT = [
  { id: 'al1', actor: 'admin@wellness.th', action: 'APPROVE_PARTNER', target: 'Zen Yoga Studio', timestamp: '2024-05-19T09:15:00Z' },
  { id: 'al2', actor: 'admin@wellness.th', action: 'SUSPEND_USER', target: 'Wipa Rat', timestamp: '2024-05-19T08:45:00Z' },
  { id: 'al3', actor: 'system', action: 'TOKEN_ALLOCATION', target: 'ABC Company Ltd. — 12,400 tokens', timestamp: '2024-05-18T23:00:00Z' },
  { id: 'al4', actor: 'admin@wellness.th', action: 'UPDATE_SETTLEMENT_RATE', target: 'Global rate: 50 → 55 THB/token', timestamp: '2024-05-18T16:20:00Z' },
  { id: 'al5', actor: 'system', action: 'SETTLEMENT_COMPLETED', target: 'FitLife Studio — ฿62,500', timestamp: '2024-05-17T10:30:00Z' },
  { id: 'al6', actor: 'admin@wellness.th', action: 'REJECT_PARTNER', target: 'Suspicious Gym Co.', timestamp: '2024-05-16T14:00:00Z' },
];

const ACTION_LABEL: Record<string, string> = {
  APPROVE_PARTNER: '✅ Approve Partner',
  SUSPEND_USER: '🚫 Suspend User',
  TOKEN_ALLOCATION: '💰 Allocate Tokens',
  UPDATE_SETTLEMENT_RATE: '⚙️ Update Settlement Rate',
  SETTLEMENT_COMPLETED: '💳 Settlement Completed',
  REJECT_PARTNER: '❌ Reject Partner',
};

export default function AuditPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>Audit Log</h1>
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th></tr></thead>
          <tbody>
            {MOCK_AUDIT.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleString('th-TH')}
                </td>
                <td>
                  <code style={{ fontSize: 'var(--font-size-xs)', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: 4 }}>
                    {log.actor}
                  </code>
                </td>
                <td style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {ACTION_LABEL[log.action] || log.action}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {log.target}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
