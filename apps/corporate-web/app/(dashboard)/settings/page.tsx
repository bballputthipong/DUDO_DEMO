'use client';

import { Building2, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 640 }}>
      <div>
        <h1 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-2xl)' }}>Settings</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          ManageInfoCompanyAndการSettingsSystem
        </p>
      </div>

      {/* Company Info */}
      <div className="dashboard-card">
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Building2 size={18} /> InfoCompany
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="company-name">Company Name</label>
            <input id="company-name" className="form-input" defaultValue="ABC Company Ltd." />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="company-email">Contact Email</label>
            <input id="company-email" className="form-input" type="email" defaultValue="hr@abc.co.th" />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="company-domain">Email DomainEmployee</label>
            <input id="company-domain" className="form-input" defaultValue="@abc.co.th" />
            <span className="form-hint">Used for automatic employee email verification</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="dashboard-card">
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Bell size={18} /> Notifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[
            { label: 'ReportSummaryรายสัปดาห์', checked: true },
            { label: 'Token low balance alerts', checked: true },
            { label: 'NotificationsEmployeeNewConfirmEmail', checked: false },
          ].map((item) => (
            <label key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}>
              <input type="checkbox" defaultChecked={item.checked} style={{ width: 18, height: 18, accentColor: 'var(--color-navy-700)' }} />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="dashboard-card">
        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Shield size={18} /> Security
        </h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: '0 0 var(--space-4)' }}>
          InfoEmployeeแต่ละpplจะNotถูกแสดงInแดชบอร์ด — แสดงเฉพาะInfoTotalstatisticalเท่านั้น
        </p>
        <div style={{
          padding: 'var(--space-3) var(--space-4)', background: '#dcfce7', borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)', color: '#166534', display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        }}>
          <Shield size={14} /> Privacy-safe mode: เCloseUseงาน ✓
        </div>
      </div>

      <button style={{
        alignSelf: 'flex-end', padding: 'var(--space-3) var(--space-6)',
        background: 'var(--action-primary-bg)', color: 'var(--action-primary-text)',
        border: 'none', borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
      }}>
        SaveการChangeแปลง
      </button>
    </div>
  );
}
