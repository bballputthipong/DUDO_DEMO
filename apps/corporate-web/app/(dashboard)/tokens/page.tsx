'use client';

import { Coins, Send, Calendar } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const MOCK_ALLOCATIONS = [
  { month: '2024-05', totalTokens: 12400, usedTokens: 8978, employees: 248 },
  { month: '2024-04', totalTokens: 12400, usedTokens: 10200, employees: 248 },
  { month: '2024-03', totalTokens: 11500, usedTokens: 9100, employees: 230 },
];

export default function TokensPage() {
  const [perEmployee, setPerEmployee] = useState('50');
  const [month, setMonth] = useState('2024-06');

  function handleAllocate(e: FormEvent) {
    e.preventDefault();
    alert(`Allocate ${perEmployee} Token/ppl forMonth ${month}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Allocate Token</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Allocate wellness token ให้EmployeeรายMonth
        </p>
      </div>

      {/* Allocate form */}
      <form onSubmit={handleAllocate} className="dashboard-card" style={{ maxWidth: 520 }}>
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>
          <Send size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
          Allocate Token PendingบNew
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div className="form-field" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="alloc-month">Month</label>
            <input id="alloc-month" className="form-input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div className="form-field" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="alloc-per">Token / Person</label>
            <input id="alloc-per" className="form-input" type="number" min="1" value={perEmployee} onChange={(e) => setPerEmployee(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          ประมาณการ: <strong style={{ color: 'var(--text-heading)' }}>{(248 * Number(perEmployee || 0)).toLocaleString()} Token</strong> for 248 Employee
        </div>
        <button type="submit" style={{
          width: '100%', padding: 'var(--space-3)', background: 'var(--action-primary-bg)',
          color: 'var(--action-primary-text)', border: 'none', borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
        }}>
          <Coins size={16} /> Allocate Token
        </button>
      </form>

      {/* History */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)' }}>
            <Calendar size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            Allocation History
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Month</th><th>Tokens Allocated</th><th>Tokens Used</th><th>Usage Rate</th><th>Employee</th></tr>
          </thead>
          <tbody>
            {MOCK_ALLOCATIONS.map((a) => {
              const rate = ((a.usedTokens / a.totalTokens) * 100).toFixed(1);
              return (
                <tr key={a.month}>
                  <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{a.month}</td>
                  <td>{a.totalTokens.toLocaleString()}</td>
                  <td>{a.usedTokens.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: 80, height: 6, background: 'var(--bg-section)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${rate}%`, background: Number(rate) > 80 ? '#16a34a' : 'var(--color-navy-600)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)' }}>{rate}%</span>
                    </div>
                  </td>
                  <td>{a.employees}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
