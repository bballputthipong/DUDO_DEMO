'use client';

import {
  ArrowLeft,
  Calendar,
  Clock,
  Coins,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// import { useAuthStore } from '@/lib/auth-store';
import type { BookingStatus } from '@/lib/types';
import { formatDate, formatTime, formatTokens } from '@/lib/utils';

import { BookingStatusBadge } from '../../_components/BookingStatusBadge';

// Mock booking data — will be replaced with useBookingDetail hook
function getMockBooking(id: string) {
  return {
    id,
    userId: 'u1',
    partnerId: 'p1',
    offerId: 'o1',
    slotId: 's1',
    companyId: null,
    tokenUsed: 5,
    tokenSource: 'PERSONAL' as const,
    status: 'CONFIRMED' as BookingStatus,
    checkInCode: 'CHK-001',
    checkedInAt: null,
    completedAt: null,
    cancelledAt: null,
    cancelReason: null,
    noShowAt: null,
    refundedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: 'u1',
      name: 'Somchai Jaidee',
      email: 'somchai@email.com',
      phone: '081-234-5678',
      avatarUrl: null,
    },
    offer: {
      id: 'o1',
      partnerId: 'p1',
      name: 'Morning Yoga Flow',
      type: 'CLASS' as const,
      category: 'yoga',
      description: 'ClassYogaยามMorning suitableforEveryระดับ',
      coverImageUrl: null,
      tokenPrice: 5,
      durationMinutes: 60,
      capacity: 20,
      cancellationHours: 24,
      isPublic: true,
      status: 'ACTIVE' as const,
      createdAt: '',
      updatedAt: '',
    },
    slot: {
      id: 's1',
      offerId: 'o1',
      instructorName: 'ครูแนน',
      startTime: new Date(Date.now() + 3600000).toISOString(),
      endTime: new Date(Date.now() + 7200000).toISOString(),
      capacity: 20,
      availableCapacity: 15,
      status: 'AVAILABLE' as const,
      notes: null,
      createdAt: '',
      updatedAt: '',
    },
  };
}

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  // const partner = useAuthStore((s) => s.partner);
  const booking = getMockBooking(bookingId);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  async function handleAction(action: string) {
    setActionLoading(action);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setActionSuccess(action);
    setActionLoading(null);
    setTimeout(() => setActionSuccess(null), 3000);
  }

  const canCheckIn = booking.status === 'CONFIRMED';
  const canComplete = booking.status === 'CHECKED_IN';
  const canNoShow = booking.status === 'CONFIRMED';

  return (
    <div className="detail-page">
      {/* Back nav */}
      <Link href="/bookings" className="back-link">
        <ArrowLeft size={18} />
        BackไปรายBooking
      </Link>

      <div className="detail-grid">
        {/* Main info */}
        <div className="dashboard-card">
          <div className="detail-header">
            <div>
              <h2 style={{ margin: '0 0 var(--space-1) 0' }}>{booking.offer?.name}</h2>
              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Booking #{booking.id}
              </span>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="detail-divider" />

          {/* Slot info */}
          <div className="detail-row-grid">
            <div className="detail-info-item">
              <Calendar size={16} />
              <div>
                <span className="detail-info-label">Date</span>
                <span className="detail-info-value">
                  {booking.slot ? formatDate(booking.slot.startTime) : '-'}
                </span>
              </div>
            </div>
            <div className="detail-info-item">
              <Clock size={16} />
              <div>
                <span className="detail-info-label">Time</span>
                <span className="detail-info-value">
                  {booking.slot
                    ? `${formatTime(booking.slot.startTime)} – ${formatTime(booking.slot.endTime)}`
                    : '-'}
                </span>
              </div>
            </div>
            <div className="detail-info-item">
              <Coins size={16} />
              <div>
                <span className="detail-info-label">Tokens Used</span>
                <span className="detail-info-value">{formatTokens(booking.tokenUsed)} token</span>
              </div>
            </div>
            <div className="detail-info-item">
              <User size={16} />
              <div>
                <span className="detail-info-label">Instructor</span>
                <span className="detail-info-value">{booking.slot?.instructorName || '-'}</span>
              </div>
            </div>
          </div>

          <div className="detail-divider" />

          {/* QR / Check-in code */}
          <div className="checkin-code-section">
            <QrCode size={20} />
            <div>
              <span className="detail-info-label">Check-in Code</span>
              <code className="checkin-code">{booking.checkInCode}</code>
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="detail-sidebar">
          <div className="dashboard-card">
            <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>
              Customer Info
            </h3>

            <div className="customer-avatar">
              {booking.user?.name.charAt(0)}
            </div>
            <div className="customer-name">{booking.user?.name}</div>

            <div className="customer-details">
              <div className="customer-detail-item">
                <Mail size={14} />
                <span>{booking.user?.email}</span>
              </div>
              {booking.user?.phone && (
                <div className="customer-detail-item">
                  <Phone size={14} />
                  <span>{booking.user.phone}</span>
                </div>
              )}
            </div>

            <div className="detail-divider" />

            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>Token Source</span>
              <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                {booking.tokenSource === 'PERSONAL' ? 'ส่วนตัว' :
                 booking.tokenSource === 'CORPORATE' ? 'Company' : 'โOnัส'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="dashboard-card">
            <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: 'var(--font-size-md)' }}>
              Actions
            </h3>

            <div className="action-buttons">
              {canCheckIn && (
                <button
                  className="action-btn action-btn-primary"
                  disabled={actionLoading !== null}
                  onClick={() => handleAction('checkin')}
                >
                  {actionLoading === 'checkin' ? (
                    <span className="spinner" />
                  ) : actionSuccess === 'checkin' ? (
                    <><CheckCircle2 size={18} /> Check-in Successful!</>
                  ) : (
                    <><CheckCircle2 size={18} /> Confirm Check-in</>
                  )}
                </button>
              )}

              {canComplete && (
                <button
                  className="action-btn action-btn-success"
                  disabled={actionLoading !== null}
                  onClick={() => handleAction('complete')}
                >
                  {actionLoading === 'complete' ? (
                    <span className="spinner" />
                  ) : actionSuccess === 'complete' ? (
                    <><CheckCircle2 size={18} /> Completed!</>
                  ) : (
                    <><CheckCircle2 size={18} /> Complete Activity</>
                  )}
                </button>
              )}

              {canNoShow && (
                <button
                  className="action-btn action-btn-warning"
                  disabled={actionLoading !== null}
                  onClick={() => handleAction('noshow')}
                >
                  {actionLoading === 'noshow' ? (
                    <span className="spinner" />
                  ) : (
                    <><AlertTriangle size={18} /> No-show</>
                  )}
                </button>
              )}

              {booking.status === 'COMPLETED' && (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--space-4)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                }}>
                  ✅ This activity is completed
                </div>
              )}

              {(booking.status === 'CANCELLED' || booking.status === 'NO_SHOW' || booking.status === 'REFUNDED') && (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--space-4)',
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--font-size-sm)',
                }}>
                  No actions available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--duration-fast) var(--ease-standard);
        }

        .back-link:hover {
          color: var(--text-brand);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: var(--space-4);
          align-items: start;
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
        }

        .detail-divider {
          border: none;
          border-top: 1px solid var(--border-subtle);
          margin: var(--space-4) 0;
        }

        .detail-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .detail-info-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          color: var(--text-secondary);
        }

        .detail-info-item div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-info-label {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }

        .detail-info-value {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-heading);
        }

        .checkin-code-section {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-app);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
        }

        .checkin-code {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-heading);
          letter-spacing: var(--letter-spacing-wider);
          background: none;
        }

        .detail-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: var(--color-navy-700);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          margin: 0 auto var(--space-2);
        }

        .customer-name {
          text-align: center;
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--text-heading);
          margin-bottom: var(--space-4);
        }

        .customer-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .customer-detail-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .action-btn {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn-primary {
          background: var(--color-navy-700);
          color: white;
        }

        .action-btn-primary:hover:not(:disabled) {
          background: var(--color-navy-600);
        }

        .action-btn-success {
          background: #16a34a;
          color: white;
        }

        .action-btn-success:hover:not(:disabled) {
          background: #15803d;
        }

        .action-btn-warning {
          background: var(--bg-base);
          color: #dc2626;
          border: 1.5px solid #fecaca;
        }

        .action-btn-warning:hover:not(:disabled) {
          background: #fee2e2;
        }

        @media (max-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
