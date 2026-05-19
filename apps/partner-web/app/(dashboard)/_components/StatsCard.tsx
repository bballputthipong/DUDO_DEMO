import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'navy' | 'accent';
  trend?: { value: number; label: string };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'navy',
  trend,
}: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${variant}`}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-1)',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-heading)',
            lineHeight: 'var(--line-height-tight)',
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-1)',
            }}
          >
            {subtitle}
          </div>
        )}
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              color: trend.value >= 0 ? '#16a34a' : '#dc2626',
              marginTop: 'var(--space-1)',
            }}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
    </div>
  );
}
