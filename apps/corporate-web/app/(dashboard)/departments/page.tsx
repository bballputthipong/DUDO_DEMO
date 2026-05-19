'use client';

import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';

const MOCK_DEPARTMENTS = [
  { id: 'd1', name: 'วิศวกรรม', employees: 85, activeRate: 82, topCategory: 'gym', totalBookings: 342 },
  { id: 'd2', name: 'การตลาด', employees: 42, activeRate: 91, topCategory: 'yoga', totalBookings: 198 },
  { id: 'd3', name: 'บัญชี', employees: 38, activeRate: 65, topCategory: 'swimming', totalBookings: 124 },
  { id: 'd4', name: 'ทรัพยากรบุคคล', employees: 25, activeRate: 88, topCategory: 'pilates', totalBookings: 110 },
  { id: 'd5', name: 'ฝ่ายขาย', employees: 58, activeRate: 71, topCategory: 'boxing', totalBookings: 206 },
];

const CAT_EMOJI: Record<string, string> = {
  yoga: '🧘', gym: '🏋️', swimming: '🏊', boxing: '🥊', pilates: '💪', spa: '💆',
};

export default function DepartmentsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Department</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Aggregate insights by department
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-5)',
            background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> CreateDepartment
        </button>
      </div>

      {showCreate && (
        <div className="dashboard-card" style={{ maxWidth: 400 }}>
          <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-md)' }}>CreateDepartmentNew</h3>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input className="form-input" placeholder="NameDepartment" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button style={{
              padding: 'var(--space-3) var(--space-5)',
              background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)',
              border: 'none', borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>Create</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {MOCK_DEPARTMENTS.map((dept) => (
          <div key={dept.id} className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--bg-navy-subtle)', color: 'var(--color-navy-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>
                  {dept.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  {dept.employees} employees
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>การHasparticipation</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: dept.activeRate > 80 ? '#16a34a' : dept.activeRate > 60 ? 'var(--color-accent-600)' : '#dc2626' }}>
                  {dept.activeRate}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Activities</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }}>
                  {dept.totalBookings}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>ยอดนิยม</div>
                <div style={{ fontSize: 'var(--font-size-lg)' }}>
                  {CAT_EMOJI[dept.topCategory] || '🎯'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
