'use client';

import {
  LayoutDashboard,
  Users,
  Building2,
  Coins,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Employees', href: '/employees', icon: <Users size={20} /> },
  { label: 'Departments', href: '/departments', icon: <Building2 size={20} /> },
  { label: 'Token Allocation', href: '/tokens', icon: <Coins size={20} /> },
  { label: 'Reports', href: '/reports', icon: <BarChart3 size={20} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <ShieldCheck size={collapsed ? 20 : 24} />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Wellness</span>
            <span className="sidebar-brand-sub">Corporate</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${isActive(item.href) ? 'sidebar-link-active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-company">
            <div className="sidebar-company-avatar">B</div>
            <div className="sidebar-company-info">
              <span className="sidebar-company-name">ABC Company Ltd.</span>
              <span className="sidebar-company-plan">Enterprise Plan</span>
            </div>
          </div>
        )}
        <button className="sidebar-link sidebar-logout">
          <span className="sidebar-link-icon"><LogOut size={20} /></span>
          {!collapsed && <span className="sidebar-link-label">Sign Out</span>}
        </button>
      </div>

      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <style jsx>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: var(--text-inverse);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 40;
          transition: width var(--duration-base) var(--ease-standard);
        }
        .sidebar-collapsed { width: 72px; }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-5);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-logo {
          width: 40px; height: 40px;
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sidebar-brand-text { display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-brand-name { font-size: var(--font-size-md); font-weight: var(--font-weight-bold); }
        .sidebar-brand-sub {
          font-size: var(--font-size-2xs); opacity: 0.5;
          font-weight: var(--font-weight-medium);
          letter-spacing: var(--letter-spacing-wider); text-transform: uppercase;
        }

        .sidebar-nav {
          flex: 1; display: flex; flex-direction: column;
          gap: var(--space-1); padding: var(--space-3);
        }
        .sidebar-link {
          display: flex; align-items: center; gap: var(--space-3);
          padding: var(--space-2) var(--space-3); border-radius: var(--radius-md);
          color: rgba(255,255,255,0.55); font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium); text-decoration: none;
          transition: all var(--duration-fast) var(--ease-standard);
          cursor: pointer; border: none; background: none; width: 100%; text-align: left;
        }
        .sidebar-link:hover { color: var(--text-inverse); background: rgba(255,255,255,0.06); }
        .sidebar-link-active {
          color: var(--text-inverse) !important;
          background: rgba(255,255,255,0.1) !important;
          font-weight: var(--font-weight-semibold);
        }
        .sidebar-link-icon { display: flex; align-items: center; flex-shrink: 0; }

        .sidebar-footer {
          padding: var(--space-3);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar-company {
          display: flex; align-items: center; gap: var(--space-3);
          padding: var(--space-3); margin-bottom: var(--space-2);
        }
        .sidebar-company-avatar {
          width: 36px; height: 36px; border-radius: var(--radius-full);
          background: var(--color-accent-400); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); flex-shrink: 0;
        }
        .sidebar-company-info { display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-company-name {
          font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar-company-plan { font-size: var(--font-size-2xs); opacity: 0.5; }

        .sidebar-logout { color: rgba(255,255,255,0.4) !important; }
        .sidebar-logout:hover { color: #f87171 !important; background: rgba(239,68,68,0.1) !important; }

        .sidebar-toggle {
          position: absolute; right: -14px; top: 72px;
          width: 28px; height: 28px; border-radius: var(--radius-full);
          background: var(--bg-base); border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-secondary); z-index: 50;
        }
        .sidebar-toggle:hover { transform: scale(1.1); color: var(--text-primary); }

        @media (max-width: 768px) { .sidebar { display: none; } }
      `}</style>
    </aside>
  );
}
