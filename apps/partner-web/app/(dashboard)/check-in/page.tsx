'use client';

import { QrCode, Search, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import type { BookingStatus } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';

export default function CheckInPage() {
  const [code, setCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!code || code.length < 4) return;

    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    // Simulate API call to check-in endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (code.toUpperCase() === 'CHK-001') {
      setSearchResult({
        id: 'bk_1',
        user: { name: 'Somchai Jaidee', email: 'somchai@email.com' },
        offer: { name: 'Morning Yoga Flow' },
        slot: { startTime: new Date().toISOString() },
        status: 'CONFIRMED' as BookingStatus,
      });
    } else if (code.toUpperCase() === 'CHK-002') {
      setSearchResult({
        id: 'bk_2',
        user: { name: 'Porntip Suk', email: 'porntip@corp.com' },
        offer: { name: 'Boxing Fundamentals' },
        slot: { startTime: new Date().toISOString() },
        status: 'CHECKED_IN' as BookingStatus,
      });
    } else {
      setError('NotพบInfoBooking OrCheck-in CodeNotถูกต้อง');
    }

    setIsSearching(false);
  }

  return (
    <div className="checkin-page">
      <div className="checkin-container">
        {/* Header */}
        <div className="checkin-header">
          <div className="qr-icon-wrapper">
            <QrCode size={32} />
          </div>
          <h2 style={{ margin: 'var(--space-4) 0 var(--space-1)' }}>Check-inCustomer</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
            Scan QR code from the customer app or enter 6-digit code
          </p>
        </div>

        {/* Input form */}
        <form className="checkin-form dashboard-card" onSubmit={handleSearch}>
          <div className="input-group">
            <Search size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Enter Check-in Code (e.g. CHK-...)"
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoFocus
            />
            <button
              type="submit"
              className="search-btn"
              disabled={code.length < 4 || isSearching}
            >
              {isSearching ? <span className="spinner" /> : 'Search'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
        </form>

        {/* Search Result */}
        {searchResult && (
          <div className="dashboard-card result-card">
            {searchResult.status === 'CONFIRMED' ? (
              <div className="result-success">
                <CheckCircle2 size={48} className="success-icon" />
                <h3 style={{ margin: 'var(--space-3) 0 var(--space-1)' }}>พบBooking!</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-4)' }}>
                  Please verify info before confirming check-in
                </p>
              </div>
            ) : searchResult.status === 'CHECKED_IN' ? (
              <div className="result-warning">
                <AlertTriangle size={48} className="warning-icon" />
                <h3 style={{ margin: 'var(--space-3) 0 var(--space-1)' }}>Check-inไปDone</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-4)' }}>
                  This booking has been checked in
                </p>
              </div>
            ) : null}

            <div className="booking-summary">
              <div className="summary-row">
                <span className="summary-label">Customer</span>
                <span className="summary-value">{searchResult.user.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Offers</span>
                <span className="summary-value">{searchResult.offer.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Time</span>
                <span className="summary-value">
                  {formatDate(searchResult.slot.startTime)} {formatTime(searchResult.slot.startTime)}
                </span>
              </div>
            </div>

            <Link href={`/bookings/${searchResult.id}`} className="view-detail-btn">
              View DetailsBooking <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkin-page {
          display: flex;
          justify-content: center;
          padding-top: var(--space-8);
        }

        .checkin-container {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .checkin-header {
          text-align: center;
        }

        .qr-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background: var(--bg-navy-subtle);
          color: var(--color-navy-700);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .checkin-form {
          padding: var(--space-6);
        }

        .input-group {
          position: relative;
          display: flex;
          gap: var(--space-3);
        }

        .input-icon {
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
        }

        .code-input {
          flex: 1;
          height: 52px;
          border: 2px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 0 var(--space-4) 0 var(--space-10);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          letter-spacing: 2px;
          color: var(--text-heading);
          background: var(--bg-base);
          text-transform: uppercase;
          transition: border-color var(--duration-fast) var(--ease-standard);
        }

        .code-input:focus {
          outline: none;
          border-color: var(--color-navy-700);
        }

        .code-input::placeholder {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-normal);
          letter-spacing: normal;
          color: var(--text-tertiary);
        }

        .search-btn {
          height: 52px;
          padding: 0 var(--space-6);
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: background var(--duration-fast) var(--ease-standard);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }

        .search-btn:hover:not(:disabled) {
          background: var(--action-primary-bg-hover);
        }

        .search-btn:disabled {
          background: var(--action-disabled-bg);
          color: var(--action-disabled-text);
          cursor: not-allowed;
        }

        .error-message {
          margin-top: var(--space-4);
          padding: var(--space-3) var(--space-4);
          background: #fee2e2;
          color: #dc2626;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .result-card {
          padding: var(--space-6);
        }

        .result-success, .result-warning {
          text-align: center;
          padding-bottom: var(--space-5);
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: var(--space-5);
        }

        .success-icon {
          color: #16a34a;
        }

        .warning-icon {
          color: #d97706;
        }

        .booking-summary {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) 0;
        }

        .summary-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .summary-value {
          color: var(--text-heading);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-md);
        }

        .view-detail-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3);
          background: var(--bg-app);
          color: var(--text-brand);
          text-decoration: none;
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
          transition: background var(--duration-fast) var(--ease-standard);
        }

        .view-detail-btn:hover {
          background: var(--bg-navy-subtle);
        }
      `}</style>
    </div>
  );
}
