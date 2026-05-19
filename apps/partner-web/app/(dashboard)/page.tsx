'use client';

import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Coins,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

import { useAuthStore } from '@/lib/auth-store';
import { formatTime, formatTokens } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/types';

import { BookingStatusBadge } from './_components/BookingStatusBadge';
import { StatsCard } from './_components/StatsCard';

// Mock data for dashboard — will be replaced with API hooks
const MOCK_STATS = {
  todayBookings: 12,
  todayCheckIns: 8,
  pendingBookings: 3,
  totalTokensEarned: 4250,
  weeklyBookings: [8, 12, 10, 15, 9, 14, 12],
};

const MOCK_RECENT_BOOKINGS: Booking[] = [
  {
    id: 'bk_1',
    userId: 'u1',
    partnerId: 'p1',
    offerId: 'o1',
    slotId: 's1',
    companyId: null,
    tokenUsed: 5,
    tokenSource: 'PERSONAL',
    status: 'CONFIRMED',
    checkInCode: 'CHK-001',
    checkedInAt: null,
    completedAt: null,
    cancelledAt: null,
    cancelReason: null,
    noShowAt: null,
    refundedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { id: 'u1', name: 'Somchai Jaidee', email: 'somchai@email.com', phone: '0812345678', avatarUrl: null },
    offer: { id: 'o1', partnerId: 'p1', name: 'Morning Yoga Flow', type: 'CLASS', category: 'yoga', description: null, coverImageUrl: null, tokenPrice: 5, durationMinutes: 60, capacity: 20, cancellationHours: 24, isPublic: true, status: 'ACTIVE', createdAt: '', updatedAt: '' },
    slot: { id: 's1', offerId: 'o1', instructorName: 'ครูแนน', startTime: new Date(Date.now() + 3600000).toISOString(), endTime: new Date(Date.now() + 7200000).toISOString(), capacity: 20, availableCapacity: 15, status: 'AVAILABLE', notes: null, createdAt: '', updatedAt: '' },
  },
  {
    id: 'bk_2',
    userId: 'u2',
    partnerId: 'p1',
    offerId: 'o2',
    slotId: 's2',
    companyId: 'c1',
    tokenUsed: 8,
    tokenSource: 'CORPORATE',
    status: 'CHECKED_IN',
    checkInCode: 'CHK-002',
    checkedInAt: new Date().toISOString(),
    completedAt: null,
    cancelledAt: null,
    cancelReason: null,
    noShowAt: null,
    refundedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { id: 'u2', name: 'Porntip Suk', email: 'porntip@corp.com', phone: '0898765432', avatarUrl: null },
    offer: { id: 'o2', partnerId: 'p1', name: 'Boxing Fundamentals', type: 'CLASS', category: 'boxing', description: null, coverImageUrl: null, tokenPrice: 8, durationMinutes: 45, capacity: 15, cancellationHours: 12, isPublic: true, status: 'ACTIVE', createdAt: '', updatedAt: '' },
    slot: { id: 's2', offerId: 'o2', instructorName: 'โค้ชบิ๊ก', startTime: new Date(Date.now() - 1800000).toISOString(), endTime: new Date(Date.now() + 900000).toISOString(), capacity: 15, availableCapacity: 5, status: 'AVAILABLE', notes: null, createdAt: '', updatedAt: '' },
  },
  {
    id: 'bk_3',
    userId: 'u3',
    partnerId: 'p1',
    offerId: 'o1',
    slotId: 's3',
    companyId: null,
    tokenUsed: 5,
    tokenSource: 'BONUS',
    status: 'PENDING',
    checkInCode: 'CHK-003',
    checkedInAt: null,
    completedAt: null,
    cancelledAt: null,
    cancelReason: null,
    noShowAt: null,
    refundedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: { id: 'u3', name: 'Wipa Rat', email: 'wipa@email.com', phone: null, avatarUrl: null },
    offer: { id: 'o1', partnerId: 'p1', name: 'Morning Yoga Flow', type: 'CLASS', category: 'yoga', description: null, coverImageUrl: null, tokenPrice: 5, durationMinutes: 60, capacity: 20, cancellationHours: 24, isPublic: true, status: 'ACTIVE', createdAt: '', updatedAt: '' },
    slot: { id: 's3', offerId: 'o1', instructorName: 'ครูแนน', startTime: new Date(Date.now() + 7200000).toISOString(), endTime: new Date(Date.now() + 10800000).toISOString(), capacity: 20, availableCapacity: 18, status: 'AVAILABLE', notes: null, createdAt: '', updatedAt: '' },
  },
];

const DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export default function DashboardOverviewPage() {
  const partner = useAuthStore((s) => s.partner);
  const maxWeekly = Math.max(...MOCK_STATS.weeklyBookings);

  return (
    <div className="overview">
      {/* Welcome section */}
      <div className="welcome-banner">
        <div>
          <h2 className="welcome-title">
            Welcome, {partner?.businessName || 'Partner'} 👋
          </h2>
          <p className="welcome-sub">
            Here is your activity summary for today
          </p>
        </div>
        <Link href="/check-in" className="welcome-cta">
          <CheckCircle2 size={18} />
          Check-inCustomer
        </Link>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatsCard
          title="Today's Bookings"
          value={MOCK_STATS.todayBookings}
          subtitle="From 3 Offers"
          icon={<CalendarCheck size={24} />}
          variant="navy"
        />
        <StatsCard
          title="Check-indayนี้"
          value={MOCK_STATS.todayCheckIns}
          subtitle={`${Math.round((MOCK_STATS.todayCheckIns / MOCK_STATS.todayBookings) * 100)}% OfการBookings`}
          icon={<CheckCircle2 size={24} />}
          variant="navy"
        />
        <StatsCard
          title="Pending"
          value={MOCK_STATS.pendingBookings}
          subtitle="ต้องProcessing"
          icon={<Clock size={24} />}
          variant="accent"
        />
        <StatsCard
          title="Token AtReceivedmonthนี้"
          value={formatTokens(MOCK_STATS.totalTokensEarned)}
          subtitle="token"
          icon={<Coins size={24} />}
          variant="accent"
          trend={{ value: 12, label: 'vs monthBefore' }}
        />
      </div>

      {/* Bottom row */}
      <div className="overview-bottom">
        {/* Weekly chart */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <h3>Weekly Bookings</h3>
            <div className="card-header-badge">
              <TrendingUp size={14} />
              This Week
            </div>
          </div>
          <div className="weekly-chart">
            {MOCK_STATS.weeklyBookings.map((count, i) => (
              <div key={i} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(count / maxWeekly) * 100}%`,
                      background:
                        count === maxWeekly
                          ? 'var(--color-accent-400)'
                          : i === new Date().getDay() - 1
                            ? 'var(--color-navy-400)'
                            : 'var(--color-navy-600)',
                    }}
                  />
                </div>
                <span
                  className="chart-label"
                  style={{
                    color:
                      count === maxWeekly
                        ? 'var(--color-accent-600)'
                        : i === new Date().getDay() - 1
                          ? 'var(--color-navy-700)'
                          : 'var(--text-tertiary)',
                    fontWeight: count === maxWeekly || i === new Date().getDay() - 1 ? 700 : 600,
                  }}
                >
                  {DAY_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="dashboard-card recent-card">
          <div className="card-header">
            <h3>Recent Bookings</h3>
            <Link href="/bookings" className="card-header-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="recent-list">
            {MOCK_RECENT_BOOKINGS.map((booking) => (
              <Link
                key={booking.id}
                href={`/bookings/${booking.id}`}
                className="recent-item"
              >
                <div className="recent-item-avatar">
                  <Users size={16} />
                </div>
                <div className="recent-item-info">
                  <span className="recent-item-name">{booking.user?.name}</span>
                  <span className="recent-item-offer">{booking.offer?.name}</span>
                </div>
                <div className="recent-item-meta">
                  <BookingStatusBadge status={booking.status as BookingStatus} />
                  <span className="recent-item-time">
                    {booking.slot ? formatTime(booking.slot.startTime) : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .welcome-banner {
          background: linear-gradient(135deg, var(--color-navy-800) 0%, var(--color-navy-700) 100%);
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-8);
          color: var(--text-inverse);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .welcome-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-inverse);
          margin: 0 0 var(--space-1) 0;
        }

        .welcome-sub {
          font-size: var(--font-size-sm);
          opacity: 0.7;
          margin: 0;
        }

        .welcome-cta {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-5);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          color: var(--text-inverse);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          text-decoration: none;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .welcome-cta:hover {
          background: rgba(255, 255, 255, 0.25);
          color: var(--text-inverse);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }

        .overview-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
        }

        .card-header h3 {
          font-size: var(--font-size-md);
          margin: 0;
        }

        .card-header-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: var(--text-secondary);
          background: var(--bg-app);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
        }

        .card-header-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-accent);
          text-decoration: none;
          transition: color var(--duration-fast) var(--ease-standard);
        }

        .card-header-link:hover {
          color: var(--color-accent-600);
        }

        /* Weekly chart */
        .weekly-chart {
          display: flex;
          align-items: flex-end;
          gap: var(--space-2);
          height: 120px;
          padding-top: var(--space-2);
        }

        .chart-bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          height: 100%;
        }

        .chart-bar-container {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
        }

        .chart-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          min-height: 8px;
          transition: height var(--duration-slow) var(--ease-decelerate);
        }

        .chart-label {
          font-size: 9px;
          font-weight: var(--font-weight-semibold);
          color: var(--text-tertiary);
          text-align: center;
        }

        /* Recent bookings */
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: inherit;
          transition: background var(--duration-fast) var(--ease-standard);
        }

        .recent-item:hover {
          background: var(--bg-app);
        }

        .recent-item-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: var(--bg-navy-subtle);
          color: var(--color-navy-700);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .recent-item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recent-item-name {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-heading);
        }

        .recent-item-offer {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .recent-item-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .recent-item-time {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .overview-bottom {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
