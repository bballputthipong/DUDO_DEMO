'use client';

import { Search, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { Booking, BookingStatus } from '@/lib/types';
import { formatDate, formatTime, formatTokens, BOOKING_STATUS_LABELS } from '@/lib/utils';

import { BookingStatusBadge } from '../_components/BookingStatusBadge';

const ALL_STATUSES: BookingStatus[] = [
  'PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REFUNDED',
];

// Mock data — will be replaced with usePartnerBookings hook
const MOCK_BOOKINGS: Booking[] = Array.from({ length: 15 }, (_, i) => ({
  id: `bk_${i + 1}`,
  userId: `u${i + 1}`,
  partnerId: 'p1',
  offerId: `o${(i % 3) + 1}`,
  slotId: `s${i + 1}`,
  companyId: i % 4 === 0 ? 'c1' : null,
  tokenUsed: [5, 8, 3, 10][i % 4]!,
  tokenSource: (['PERSONAL', 'CORPORATE', 'BONUS', 'PERSONAL'] as const)[i % 4]!,
  status: ALL_STATUSES[i % 7]!,
  checkInCode: `CHK-${String(i + 1).padStart(3, '0')}`,
  checkedInAt: i % 7 === 2 ? new Date().toISOString() : null,
  completedAt: i % 7 === 3 ? new Date().toISOString() : null,
  cancelledAt: i % 7 === 4 ? new Date().toISOString() : null,
  cancelReason: i % 7 === 4 ? 'ติดธุระ' : null,
  noShowAt: i % 7 === 5 ? new Date().toISOString() : null,
  refundedAt: i % 7 === 6 ? new Date().toISOString() : null,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  user: {
    id: `u${i + 1}`,
    name: ['Somchai Jaidee', 'Porntip Suk', 'Wipa Rat', 'Tana Pon', 'กมล ศรี'][i % 5]!,
    email: `user${i + 1}@email.com`,
    phone: `081${String(i).padStart(7, '0')}`,
    avatarUrl: null,
  },
  offer: {
    id: `o${(i % 3) + 1}`,
    partnerId: 'p1',
    name: ['Morning Yoga Flow', 'Boxing Fundamentals', 'Pilates Core'][i % 3]!,
    type: 'CLASS',
    category: ['yoga', 'boxing', 'pilates'][i % 3]!,
    description: null,
    coverImageUrl: null,
    tokenPrice: [5, 8, 3][i % 3]!,
    durationMinutes: [60, 45, 50][i % 3]!,
    capacity: 20,
    cancellationHours: 24,
    isPublic: true,
    status: 'ACTIVE',
    createdAt: '',
    updatedAt: '',
  },
  slot: {
    id: `s${i + 1}`,
    offerId: `o${(i % 3) + 1}`,
    instructorName: ['ครูแนน', 'โค้ชบิ๊ก', 'ครูมิน'][i % 3]!,
    startTime: new Date(Date.now() + (i - 5) * 3600000).toISOString(),
    endTime: new Date(Date.now() + (i - 4) * 3600000).toISOString(),
    capacity: 20,
    availableCapacity: 20 - (i % 8),
    status: 'AVAILABLE',
    notes: null,
    createdAt: '',
    updatedAt: '',
  },
}));

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_BOOKINGS.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.user?.name.toLowerCase().includes(q) ||
        b.offer?.name.toLowerCase().includes(q) ||
        b.checkInCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bookings-page">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search">
          <Search size={16} className="toolbar-search-icon" />
          <input
            className="form-input"
            placeholder="Search name, offers, or check-in code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 'var(--space-10)' }}
          />
        </div>

        <div className="toolbar-filters">
          <div className="filter-pills">
            <button
              className={`filter-pill ${statusFilter === 'ALL' ? 'filter-pill-active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All
            </button>
            {ALL_STATUSES.slice(0, 5).map((s) => (
              <button
                key={s}
                className={`filter-pill ${statusFilter === s ? 'filter-pill-active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {BOOKING_STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <button className="toolbar-btn" title="Export CSV">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Filter size={28} /></div>
            <p>No bookings match the criteria</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Offers</th>
                <th>Date / Time</th>
                <th>Token</th>
                <th>Source</th>
                <th>Status</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <Link
                      href={`/bookings/${booking.id}`}
                      style={{
                        color: 'var(--text-heading)',
                        fontWeight: 'var(--font-weight-semibold)',
                        textDecoration: 'none',
                      }}
                    >
                      {booking.user?.name}
                    </Link>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {booking.user?.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {booking.offer?.name}
                    </span>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {booking.slot?.instructorName}
                    </div>
                  </td>
                  <td>
                    <span>{booking.slot ? formatDate(booking.slot.startTime) : '-'}</span>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {booking.slot ? formatTime(booking.slot.startTime) : ''}
                    </div>
                  </td>
                  <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                    {formatTokens(booking.tokenUsed)}
                  </td>
                  <td>
                    <span className={`status-badge ${
                      booking.tokenSource === 'CORPORATE'
                        ? 'status-confirmed'
                        : booking.tokenSource === 'BONUS'
                          ? 'status-pending'
                          : 'status-cancelled'
                    }`}>
                      {booking.tokenSource === 'PERSONAL' ? 'ส่วนตัว' :
                       booking.tokenSource === 'CORPORATE' ? 'Company' : 'โOnัส'}
                    </span>
                  </td>
                  <td>
                    <BookingStatusBadge status={booking.status as BookingStatus} />
                  </td>
                  <td>
                    <code style={{
                      fontSize: 'var(--font-size-xs)',
                      background: 'var(--bg-app)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--text-secondary)',
                    }}>
                      {booking.checkInCode}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .bookings-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .toolbar {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .toolbar-search {
          position: relative;
          max-width: 400px;
        }

        .toolbar-search :global(.toolbar-search-icon) {
          position: absolute;
          left: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .toolbar-filters {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
        }

        .filter-pills {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: var(--space-2) var(--space-3);
          border: 1.5px solid var(--border-default);
          border-radius: var(--radius-full);
          background: var(--bg-base);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .filter-pill:hover {
          border-color: var(--color-navy-300);
          color: var(--text-brand);
          background: var(--bg-navy-subtle);
        }

        .filter-pill-active {
          background: var(--color-navy-700);
          color: var(--text-inverse);
          border-color: var(--color-navy-700);
        }

        .filter-pill-active:hover {
          background: var(--color-navy-600);
          color: var(--text-inverse);
        }

        .toolbar-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          background: var(--bg-base);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .toolbar-btn:hover {
          background: var(--bg-app);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
