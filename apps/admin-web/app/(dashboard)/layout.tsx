'use client';

import {
  LayoutDashboard, Users, Building2, UserCheck,
  ShieldAlert, FileText, LogOut,
  ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Users', href: '/users', icon: <Users size={20} /> },
  { label: 'Partners', href: '/partners', icon: <Building2 size={20} /> },
  { label: 'Approvals', href: '/approvals', icon: <UserCheck size={20} /> },
  { label: 'Security', href: '/security', icon: <ShieldAlert size={20} /> },
  { label: 'Audit Log', href: '/audit', icon: <FileText size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Shield size={collapsed ? 18 : 22} /></div>
          {!collapsed && <div className="brand-text"><span className="brand-name">Admin</span><span className="brand-sub">Console</span></div>}
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? 'active' : ''}`} title={collapsed ? item.label : undefined}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="footer">
          <button className="nav-link logout">
            <span className="nav-icon"><LogOut size={20} /></span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
        <button className="toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <style jsx>{`
          .sidebar {
            width: 250px; min-height: 100vh;
            background: #0f0f12; color: rgba(255,255,255,0.8);
            display: flex; flex-direction: column; position: fixed;
            left: 0; top: 0; bottom: 0; z-index: 40;
            transition: width 0.2s ease;
          }
          .collapsed { width: 68px; }
          .brand {
            display: flex; align-items: center; gap: 12px;
            padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .brand-icon {
            width: 38px; height: 38px; border-radius: 10px;
            background: #dc2626; color: white;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          }
          .brand-text { display: flex; flex-direction: column; }
          .brand-name { font-size: 16px; font-weight: 700; }
          .brand-sub { font-size: 10px; opacity: 0.4; text-transform: uppercase; letter-spacing: 0.1em; }
          .nav { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: 12px; }
          .nav-link {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: 8px;
            color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 500;
            text-decoration: none; transition: all 0.15s ease;
            cursor: pointer; border: none; background: none; width: 100%; text-align: left;
          }
          .nav-link:hover { color: white; background: rgba(255,255,255,0.06); }
          .active { color: white !important; background: rgba(255,255,255,0.1) !important; font-weight: 600; }
          .nav-icon { display: flex; align-items: center; flex-shrink: 0; }
          .footer { padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
          .logout { color: rgba(255,255,255,0.35) !important; }
          .logout:hover { color: #f87171 !important; background: rgba(239,68,68,0.1) !important; }
          .toggle {
            position: absolute; right: -13px; top: 68px;
            width: 26px; height: 26px; border-radius: 50%;
            background: white; border: 1px solid #e2e2e2;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: #666; z-index: 50;
          }
          .toggle:hover { transform: scale(1.1); color: #333; }
        `}</style>
      </aside>
      <main style={{ flex: 1, marginLeft: collapsed ? 68 : 250, padding: 24, background: 'var(--bg-app)', transition: 'margin-left 0.2s ease' }}>
        {children}
      </main>
    </div>
  );
}
