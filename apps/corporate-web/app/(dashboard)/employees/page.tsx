'use client';

import { Users, UserPlus, Mail } from 'lucide-react';
import { useState } from 'react';

// Aggregate employee counts only — no individual employee data per AGENT.md privacy rules
const MOCK_SUMMARY = {
  total: 248,
  active: 186,
  pendingVerification: 42,
  suspended: 20,
  departments: [
    { name: 'วิศวกรรม', count: 85 },
    { name: 'การตลาด', count: 42 },
    { name: 'บัญชี', count: 38 },
    { name: 'ทรัพยากรบุคคล', count: 25 },
    { name: 'ฝ่ายขาย', count: 58 },
  ],
};

export default function EmployeesPage() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Employee</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Total employee count by status (aggregate only)
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-5)',
            background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)',
            cursor: 'pointer',
          }}
        >
          <UserPlus size={16} /> เชิญEmployee
        </button>
      </div>

      {showInviteForm && (
        <div className="dashboard-card" style={{ maxWidth: 500 }}>
          <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-md)' }}>เชิญEmployeeNew</h3>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                className="form-input"
                placeholder="employee@company.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{ paddingLeft: 'var(--space-10)' }}
              />
            </div>
            <button
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Send Invitation
            </button>
          </div>
        </div>
      )}

      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-navy"><Users size={24} /></div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Useงานอยู่</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>{MOCK_SUMMARY.active}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-accent"><Mail size={24} /></div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>PendingConfirmEmail</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>{MOCK_SUMMARY.pendingVerification}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><Users size={24} /></div>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Suspend</div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>{MOCK_SUMMARY.suspended}</div>
          </div>
        </div>
      </div>

      {/* By department */}
      <div className="dashboard-card">
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>Employees by Department</h3>
        <table className="data-table">
          <thead><tr><th>Department</th><th>Amount</th><th>สัดส่วน</th></tr></thead>
          <tbody>
            {MOCK_SUMMARY.departments.map((dept) => (
              <tr key={dept.name}>
                <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{dept.name}</td>
                <td>{dept.count} people</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-section)', borderRadius: 3, overflow: 'hidden', maxWidth: 120 }}>
                      <div style={{ height: '100%', width: `${(dept.count / MOCK_SUMMARY.total) * 100}%`, background: 'var(--color-navy-600)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {((dept.count / MOCK_SUMMARY.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
