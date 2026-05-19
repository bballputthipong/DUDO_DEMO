'use client';

import { Bell, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/lib/auth-store';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/bookings': 'Booking',
  '/offers': 'Offers',
  '/offers/new': 'CreateOffersNew',
  '/slots': 'ManageTime',
  '/check-in': 'Check-in',
  '/settlement': 'Revenue',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/bookings/')) return 'DetailsBooking';
  if (pathname.startsWith('/offers/') && pathname.endsWith('/edit')) return 'EditOffers';
  return 'Dashboard';
}

export function TopBar() {
  const pathname = usePathname();
  const partner = useAuthStore((s) => s.partner);
  const title = getPageTitle(pathname);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="topbar-notif-dot" />
        </button>

        <div className="topbar-partner">
          <div className="topbar-avatar">
            {partner?.businessName?.charAt(0) || 'P'}
          </div>
          <span className="topbar-partner-name">
            {partner?.businessName || 'Partner'}
          </span>
        </div>
      </div>

      <style jsx>{`
        .topbar {
          height: 64px;
          background: var(--bg-base);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .topbar-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: none;
          background: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .topbar-menu-btn:hover {
          background: var(--bg-app);
        }

        .topbar-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-heading);
          margin: 0;
          letter-spacing: var(--letter-spacing-tight);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .topbar-icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          border: none;
          background: var(--bg-app);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .topbar-icon-btn:hover {
          background: var(--bg-section);
          color: var(--text-primary);
        }

        .topbar-notif-dot {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-accent-400);
          border: 2px solid var(--bg-base);
        }

        .topbar-partner {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .topbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--color-navy-700);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
        }

        .topbar-partner-name {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .topbar-menu-btn {
            display: flex;
          }
          .topbar-partner-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
