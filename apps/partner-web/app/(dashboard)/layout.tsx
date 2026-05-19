'use client';

import type { ReactNode } from 'react';

import { Sidebar } from './_components/Sidebar';
import { TopBar } from './_components/TopBar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <main className="dashboard-content">{children}</main>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
        }

        .dashboard-main {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: margin-left var(--duration-base) var(--ease-standard);
        }

        .dashboard-content {
          flex: 1;
          padding: var(--space-6);
          background: var(--bg-app);
        }

        @media (max-width: 768px) {
          .dashboard-main {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
