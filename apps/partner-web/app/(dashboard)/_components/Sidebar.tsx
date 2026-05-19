'use client';

import {
  LayoutDashboard,
  CalendarCheck,
  Tag,
  Clock,
  ScanLine,
  Wallet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuthStore } from '@/lib/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Bookings', href: '/bookings', icon: <CalendarCheck size={20} /> },
  { label: 'Offers', href: '/offers', icon: <Tag size={20} /> },
  { label: 'ManageTime', href: '/slots', icon: <Clock size={20} /> },
  { label: 'Check-in', href: '/check-in', icon: <ScanLine size={20} /> },
  { label: 'Revenue', href: '/settlement', icon: <Wallet size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { partner, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <ShieldCheck size={collapsed ? 20 : 24} />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Wellness</span>
            <span className="sidebar-brand-sub">Partner</span>
          </div>
        )}
      </div>

      {/* Navigation */}
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

      {/* Partner info + Logout */}
      <div className="sidebar-footer">
        {!collapsed && partner && (
          <div className="sidebar-partner">
            <div className="sidebar-partner-avatar">
              {partner.businessName.charAt(0)}
            </div>
            <div className="sidebar-partner-info">
              <span className="sidebar-partner-name">{partner.businessName}</span>
              <span className="sidebar-partner-type">{partner.businessType}</span>
            </div>
          </div>
        )}

        <button
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span className="sidebar-link-icon"><LogOut size={20} /></span>
          {!collapsed && <span className="sidebar-link-label">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
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
          background: var(--color-navy-950);
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

        .sidebar-collapsed {
          width: 72px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sidebar-logo {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-navy-700);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-brand-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-brand-name {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-bold);
          line-height: 1.2;
        }

        .sidebar-brand-sub {
          font-size: var(--font-size-2xs);
          opacity: 0.5;
          font-weight: var(--font-weight-medium);
          letter-spacing: var(--letter-spacing-wider);
          text-transform: uppercase;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          padding: var(--space-3);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          color: rgba(255, 255, 255, 0.6);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          text-decoration: none;
          transition: all var(--duration-fast) var(--ease-standard);
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .sidebar-link:hover {
          color: var(--text-inverse);
          background: rgba(255, 255, 255, 0.06);
        }

        .sidebar-link-active {
          color: var(--text-inverse) !important;
          background: var(--color-navy-700) !important;
          font-weight: var(--font-weight-semibold);
        }

        .sidebar-link-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .sidebar-link-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-footer {
          padding: var(--space-3);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sidebar-partner {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .sidebar-partner-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--color-accent-400);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          flex-shrink: 0;
        }

        .sidebar-partner-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-partner-name {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-partner-type {
          font-size: var(--font-size-2xs);
          opacity: 0.5;
        }

        .sidebar-logout {
          color: rgba(255, 255, 255, 0.45) !important;
        }

        .sidebar-logout:hover {
          color: #f87171 !important;
          background: rgba(239, 68, 68, 0.1) !important;
        }

        .sidebar-toggle {
          position: absolute;
          right: -14px;
          top: 72px;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background: var(--bg-base);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          z-index: 50;
          transition: transform var(--duration-fast) var(--ease-standard);
        }

        .sidebar-toggle:hover {
          transform: scale(1.1);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
