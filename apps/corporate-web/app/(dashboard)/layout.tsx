'use client';

import type { ReactNode } from 'react';

import { Sidebar } from './_components/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 260, padding: 'var(--space-6)', background: 'var(--bg-app)' }}>
        {children}
      </main>
    </div>
  );
}
