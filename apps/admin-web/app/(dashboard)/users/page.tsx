'use client';

import { Search, Ban, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const MOCK_USERS = [
  { id: 'u1', name: 'Somchai Jaidee', email: 'somchai@email.com', role: 'USER', status: 'ACTIVE', joinedAt: '2024-01-15' },
  { id: 'u2', name: 'Porntip Suk', email: 'porntip@abc.co.th', role: 'USER', status: 'ACTIVE', joinedAt: '2024-02-01' },
  { id: 'u3', name: 'Wipa Rat', email: 'wipa@email.com', role: 'USER', status: 'SUSPENDED', joinedAt: '2024-03-10' },
  { id: 'u4', name: 'Admin Demo', email: 'admin@wellness.th', role: 'ADMIN', status: 'ACTIVE', joinedAt: '2024-01-01' },
  { id: 'u5', name: 'Tana Pon', email: 'tana@email.com', role: 'USER', status: 'ACTIVE', joinedAt: '2024-04-20' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter((u) => u.name.includes(search) || u.email.includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>Users</h1>
      <div style={{ position: 'relative', maxWidth: 360 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input className="form-input" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 'var(--space-10)' }} />
      </div>
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Manage</th></tr></thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{user.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.role === 'ADMIN' ? 'status-no-show' : 'status-confirmed'}`}>
                    {user.role === 'ADMIN' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'ACTIVE' ? 'status-completed' : 'status-cancelled'}`}>
                    {user.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{user.joinedAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {user.status === 'ACTIVE' ? (
                      <button title="Suspend" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #fecaca', background: 'white', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Ban size={14} />
                      </button>
                    ) : (
                      <button title="Reactivate" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #bbf7d0', background: 'white', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <CheckCircle2 size={14} />
                      </button>
                    )}
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
