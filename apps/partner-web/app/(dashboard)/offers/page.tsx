'use client';

import { Plus, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { Offer, OfferStatus } from '@/lib/types';
import { formatTokens, OFFER_TYPE_LABELS, OFFER_STATUS_LABELS } from '@/lib/utils';

const STATUS_FILTERS: Array<{ value: OfferStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const MOCK_OFFERS: Offer[] = [
  {
    id: 'o1', partnerId: 'p1', name: 'Morning Yoga Flow', type: 'CLASS', category: 'yoga',
    description: 'Morning yoga class for all levels. Energize and relax.',
    coverImageUrl: null, tokenPrice: 5, durationMinutes: 60, capacity: 20,
    cancellationHours: 24, isPublic: true, status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'o2', partnerId: 'p1', name: 'Boxing Fundamentals', type: 'CLASS', category: 'boxing',
    description: 'Learn boxing fundamentals. Build strength and confidence.',
    coverImageUrl: null, tokenPrice: 8, durationMinutes: 45, capacity: 15,
    cancellationHours: 12, isPublic: true, status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'o3', partnerId: 'p1', name: 'Pilates Core Strength', type: 'CLASS', category: 'pilates',
    description: 'Strengthen core muscles. Improve posture and flexibility.',
    coverImageUrl: null, tokenPrice: 6, durationMinutes: 50, capacity: 12,
    cancellationHours: 24, isPublic: true, status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const OFFER_STATUS_STYLE: Record<OfferStatus, string> = {
  ACTIVE: 'status-completed',
  DRAFT: 'status-cancelled',
  PAUSED: 'status-pending',
  ARCHIVED: 'status-no-show',
};

const CATEGORY_EMOJI: Record<string, string> = {
  yoga: '🧘', boxing: '🥊', pilates: '💪', gym: '🏋️', spa: '💆',
  swimming: '🏊', meditation: '🧠', dance: '💃', recovery: '❄️',
};

export default function OffersPage() {
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_OFFERS.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchQuery) {
      return o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.category.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="offers-page">
      <div className="page-header">
        <div>
          <h2 style={{ margin: 0 }}>All Offers</h2>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Manage your classes, activities, and services
          </p>
        </div>
        <Link href="/offers/new" className="create-btn">
          <Plus size={18} />
          Create New Offer
        </Link>
      </div>

      <div className="offers-toolbar">
        <div className="toolbar-search" style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            className="form-input"
            placeholder="Search offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 'var(--space-10)' }}
          />
        </div>
        <div className="filter-pills">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-pill ${statusFilter === f.value ? 'filter-pill-active' : ''}`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Tag size={28} /></div>
          <p style={{ margin: '0 0 var(--space-4)' }}>No offers yet</p>
          <Link href="/offers/new" className="create-btn-sm">
            <Plus size={16} />
            CreateOffersfirst
          </Link>
        </div>
      ) : (
        <div className="offers-grid">
          {filtered.map((offer) => (
            <div key={offer.id} className="offer-card dashboard-card">
              <div className="offer-card-header">
                <div className="offer-card-category">
                  <span className="offer-card-emoji">{CATEGORY_EMOJI[offer.category] || '🎯'}</span>
                  <span className="offer-card-type">{OFFER_TYPE_LABELS[offer.type]}</span>
                </div>
                <span className={`status-badge ${OFFER_STATUS_STYLE[offer.status]}`}>
                  {OFFER_STATUS_LABELS[offer.status]}
                </span>
              </div>
              <h3 className="offer-card-title">{offer.name}</h3>
              <p className="offer-card-desc">{offer.description}</p>
              <div className="offer-card-meta">
                <div className="offer-card-meta-item">
                  <span className="offer-card-meta-label">Token</span>
                  <span className="offer-card-meta-value">{formatTokens(offer.tokenPrice)}</span>
                </div>
                {offer.durationMinutes && (
                  <div className="offer-card-meta-item">
                    <span className="offer-card-meta-label">Duration</span>
                    <span className="offer-card-meta-value">{offer.durationMinutes} min</span>
                  </div>
                )}
                {offer.capacity && (
                  <div className="offer-card-meta-item">
                    <span className="offer-card-meta-label">Capacity</span>
                    <span className="offer-card-meta-value">{offer.capacity} people</span>
                  </div>
                )}
              </div>
              <div className="offer-card-footer">
                <Link href={`/offers/${offer.id}/edit`} className="offer-edit-btn">
                  Edit
                </Link>
                <Link href={`/slots?offerId=${offer.id}`} className="offer-slots-btn">
                  ManageTime
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .offers-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .create-btn, .create-btn-sm {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5);
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          text-decoration: none;
          cursor: pointer;
          transition: background var(--duration-fast) var(--ease-standard);
        }

        .create-btn:hover, .create-btn-sm:hover {
          background: var(--action-primary-bg-hover);
          color: var(--action-primary-text);
        }

        .create-btn-sm {
          padding: var(--space-2) var(--space-4);
          font-size: var(--font-size-sm);
        }

        .offers-toolbar {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
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

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: var(--space-4);
        }

        .offer-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .offer-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .offer-card-category {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .offer-card-emoji {
          font-size: var(--font-size-lg);
        }

        .offer-card-type {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
        }

        .offer-card-title {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-bold);
          margin: 0;
          line-height: var(--line-height-snug);
        }

        .offer-card-desc {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
          line-height: var(--line-height-base);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .offer-card-meta {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-3) 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .offer-card-meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .offer-card-meta-label {
          font-size: var(--font-size-2xs);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-caps);
          font-weight: var(--font-weight-bold);
        }

        .offer-card-meta-value {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-heading);
        }

        .offer-card-footer {
          display: flex;
          gap: var(--space-2);
        }

        .offer-edit-btn, .offer-slots-btn {
          flex: 1;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          text-align: center;
          text-decoration: none;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .offer-edit-btn {
          background: var(--bg-app);
          color: var(--text-brand);
          border: 1px solid var(--border-subtle);
        }

        .offer-edit-btn:hover {
          background: var(--bg-navy-subtle);
          color: var(--text-brand);
        }

        .offer-slots-btn {
          background: var(--bg-navy-subtle);
          color: var(--text-brand);
          border: 1px solid transparent;
        }

        .offer-slots-btn:hover {
          background: var(--color-navy-100);
          color: var(--text-brand);
        }

        @media (max-width: 768px) {
          .offers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
