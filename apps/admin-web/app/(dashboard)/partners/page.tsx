'use client';

import { Building2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

const MOCK_PARTNERS = [
  { id: 'p1', name: 'FitLife Studio', type: 'GYM', status: 'APPROVED', offers: 8, rating: 4.7 },
  { id: 'p2', name: 'Zen Yoga Center', type: 'YOGA_STUDIO', status: 'APPROVED', offers: 5, rating: 4.9 },
  { id: 'p3', name: 'Thai Boxing Academy', type: 'GYM', status: 'APPROVED', offers: 3, rating: 4.5 },
  { id: 'p4', name: 'Serenity Spa', type: 'SPA', status: 'PENDING', offers: 0, rating: 0 },
  { id: 'p5', name: 'Aqua Pool Club', type: 'POOL', status: 'SUSPENDED', offers: 4, rating: 3.8 },
];

export default function PartnersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>Partners</h1>
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Offers</th><th>Rating</th><th>Manage</th></tr></thead>
          <tbody>
            {MOCK_PARTNERS.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Building2 size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {p.name}
                  </div>
                </td>
                <td><span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{p.type}</span></td>
                <td>
                  <span className={`status-badge ${
                    p.status === 'APPROVED' ? 'status-completed' :
                    p.status === 'PENDING' ? 'status-pending' : 'status-cancelled'
                  }`}>
                    {p.status === 'APPROVED' ? 'Approved' : p.status === 'PENDING' ? 'Pending' : 'Suspended'}
                  </span>
                </td>
                <td>{p.offers} Offers</td>
                <td>{p.rating > 0 ? `⭐ ${p.rating}` : '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    {p.status === 'PENDING' && (
                      <>
                        <button title="Approve" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #bbf7d0', background: 'white', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><CheckCircle2 size={14} /></button>
                        <button title="Reject" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #fecaca', background: 'white', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><XCircle size={14} /></button>
                      </>
                    )}
                    <button title="View Details" style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'white', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ExternalLink size={14} /></button>
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
