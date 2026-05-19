'use client';

import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

import type { Slot, Offer } from '@/lib/types';
import { formatTime } from '@/lib/utils';

// Mock data
const MOCK_OFFER: Offer = {
  id: 'o1', partnerId: 'p1', name: 'Morning Yoga Flow', type: 'CLASS', category: 'yoga',
  description: '', coverImageUrl: null, tokenPrice: 5, durationMinutes: 60, capacity: 20,
  cancellationHours: 24, isPublic: true, status: 'ACTIVE', createdAt: '', updatedAt: '',
};

const MOCK_SLOTS: Slot[] = [
  {
    id: 's1', offerId: 'o1', instructorName: 'ครูแนน',
    startTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    capacity: 20, availableCapacity: 5, status: 'AVAILABLE', notes: null, createdAt: '', updatedAt: '',
  },
  {
    id: 's2', offerId: 'o1', instructorName: 'ครูแนน',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    capacity: 20, availableCapacity: 0, status: 'FULL', notes: null, createdAt: '', updatedAt: '',
  },
  {
    id: 's3', offerId: 'o1', instructorName: 'ครูจอย',
    startTime: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
    capacity: 20, availableCapacity: 12, status: 'AVAILABLE', notes: null, createdAt: '', updatedAt: '',
  },
];

export default function SlotsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const today = () => setCurrentDate(new Date());

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="slots-page">
      <div className="page-header">
        <div>
          <h2 style={{ margin: 0 }}>Manage Times (Slots)</h2>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            AddOrEditPendingบTimefor: <strong>{MOCK_OFFER.name}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-secondary">SettingsTimeประจำ</button>
          <button className="btn-primary">
            <Plus size={16} />
            Add Time Slot
          </button>
        </div>
      </div>

      <div className="calendar-container dashboard-card">
        {/* Calendar toolbar */}
        <div className="calendar-toolbar">
          <div className="date-nav">
            <button className="icon-btn" onClick={prevDay}>
              <ChevronLeft size={20} />
            </button>
            <div className="current-date">
              <CalendarIcon size={18} style={{ color: 'var(--text-tertiary)' }} />
              <span>
                {currentDate.toLocaleDateString('th-TH', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <button className="icon-btn" onClick={nextDay}>
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            className={`today-btn ${isToday ? 'today-btn-active' : ''}`}
            onClick={today}
            disabled={isToday}
          >
            Today
          </button>
        </div>

        {/* Slots List */}
        <div className="slots-list">
          {MOCK_SLOTS.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Clock size={28} /></div>
              <p>No time slots today</p>
              <button className="btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                <Plus size={16} />
                Add Time Slot
              </button>
            </div>
          ) : (
            MOCK_SLOTS.map((slot) => (
              <div key={slot.id} className="slot-item">
                <div className="slot-time">
                  <span className="slot-time-text">
                    {formatTime(slot.startTime)}
                  </span>
                  <span className="slot-time-separator">–</span>
                  <span className="slot-time-text" style={{ color: 'var(--text-secondary)' }}>
                    {formatTime(slot.endTime)}
                  </span>
                </div>

                <div className="slot-details">
                  <div className="slot-instructor">
                    <span className="slot-label">Instructor</span>
                    <span className="slot-value">{slot.instructorName || '-'}</span>
                  </div>
                  <div className="slot-capacity">
                    <span className="slot-label">Participants</span>
                    <div className="capacity-indicator">
                      <Users size={14} style={{ color: 'var(--text-secondary)' }} />
                      <span className="slot-value">
                        {slot.capacity - slot.availableCapacity} / {slot.capacity}
                      </span>
                      {slot.status === 'FULL' && (
                        <span className="status-badge status-no-show" style={{ fontSize: '10px', padding: '0 4px' }}>
                          Full
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="slot-actions">
                  <button className="icon-btn-danger" title="Cancel This Round">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .slots-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .btn-primary, .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .btn-primary {
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
        }

        .btn-primary:hover {
          background: var(--action-primary-bg-hover);
        }

        .btn-secondary {
          background: var(--bg-base);
          color: var(--text-primary);
          border: 1px solid var(--border-default);
        }

        .btn-secondary:hover {
          background: var(--bg-app);
          border-color: var(--color-navy-300);
        }

        .calendar-container {
          padding: 0;
          overflow: hidden;
        }

        .calendar-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-app);
        }

        .date-nav {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .current-date {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--text-heading);
          min-width: 200px;
          justify-content: center;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-base);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .icon-btn:hover {
          background: var(--bg-section);
          color: var(--text-primary);
        }

        .today-btn {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-base);
          color: var(--text-secondary);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
        }

        .today-btn:hover:not(:disabled) {
          background: var(--bg-section);
          color: var(--text-primary);
        }

        .today-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slots-list {
          display: flex;
          flex-direction: column;
        }

        .slot-item {
          display: flex;
          align-items: center;
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-subtle);
          transition: background var(--duration-fast) var(--ease-standard);
        }

        .slot-item:hover {
          background: var(--bg-app);
        }

        .slot-item:last-child {
          border-bottom: none;
        }

        .slot-time {
          width: 140px;
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-heading);
        }

        .slot-time-separator {
          color: var(--text-tertiary);
          font-weight: var(--font-weight-normal);
        }

        .slot-details {
          flex: 1;
          display: flex;
          gap: var(--space-8);
        }

        .slot-instructor, .slot-capacity {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .slot-label {
          font-size: var(--font-size-2xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
        }

        .slot-value {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        .capacity-indicator {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .icon-btn-danger {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          border: none;
          background: none;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .icon-btn-danger:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .slot-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-3);
          }
          .slot-details {
            flex-direction: column;
            gap: var(--space-3);
            width: 100%;
          }
          .slot-actions {
            align-self: flex-end;
            margin-top: calc(var(--space-3) * -1);
          }
        }
      `}</style>
    </div>
  );
}
