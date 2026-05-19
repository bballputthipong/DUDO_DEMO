'use client';

import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import type { OfferType, OfferStatus } from '@/lib/types';
import { OFFER_TYPE_LABELS, OFFER_STATUS_LABELS, CATEGORY_OPTIONS } from '@/lib/utils';

const OFFER_TYPES: OfferType[] = [
  'CLASS', 'DAY_PASS', 'COURT_RESERVATION', 'APPOINTMENT', 'COURSE', 'EVENT', 'WORKSHOP',
];

const OFFER_STATUSES: OfferStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'];

// Mock — would come from useOfferDetail hook
function getMockOffer(_id: string) {
  return {
    name: 'Morning Yoga Flow',
    type: 'CLASS' as OfferType,
    category: 'yoga',
    description: 'Morning yoga class suitable for all levels. Helps energize and relax.',
    tokenPrice: '5',
    durationMinutes: '60',
    capacity: '20',
    cancellationHours: '24',
    isPublic: true,
    status: 'ACTIVE' as OfferStatus,
  };
}

export default function EditOfferPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;
  const initial = getMockOffer(offerId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initial);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push('/offers');
  }

  return (
    <div className="edit-offer-page">
      <Link href="/offers" className="back-link">
        <ArrowLeft size={18} />
        Back to offers
      </Link>

      <div className="form-container dashboard-card">
        <div className="form-header">
          <div>
            <h2 style={{ margin: '0 0 var(--space-1) 0' }}>Edit Offer</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
              ID: {offerId}
            </p>
          </div>
          <button className="delete-btn" title="Delete Offer">
            <Trash2 size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Status */}
            <div className="form-field form-col-full">
              <label className="form-label" htmlFor="offer-status">Status</label>
              <div className="status-pills">
                {OFFER_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-pill ${form.status === s ? 'status-pill-active' : ''}`}
                    onClick={() => updateField('status', s)}
                  >
                    {OFFER_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="form-field form-col-full">
              <label className="form-label" htmlFor="edit-name">Offer Name *</label>
              <input
                id="edit-name"
                className="form-input"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>

            {/* Type */}
            <div className="form-field">
              <label className="form-label" htmlFor="edit-type">Type</label>
              <select
                id="edit-type"
                className="form-input"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
              >
                {OFFER_TYPES.map((t) => (
                  <option key={t} value={t}>{OFFER_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="form-field">
              <label className="form-label" htmlFor="edit-category">Category</label>
              <select
                id="edit-category"
                className="form-input"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-field form-col-full">
              <label className="form-label" htmlFor="edit-desc">Details</label>
              <textarea
                id="edit-desc"
                className="form-input"
                rows={3}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Token Price */}
            <div className="form-field">
              <label className="form-label" htmlFor="edit-price">Price (Token)</label>
              <input
                id="edit-price"
                className="form-input"
                type="number"
                min="1"
                value={form.tokenPrice}
                onChange={(e) => updateField('tokenPrice', e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="form-field">
              <label className="form-label" htmlFor="edit-duration">Duration (minutes)</label>
              <input
                id="edit-duration"
                className="form-input"
                type="number"
                min="15"
                step="5"
                value={form.durationMinutes}
                onChange={(e) => updateField('durationMinutes', e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div className="form-field">
              <label className="form-label" htmlFor="edit-capacity">Capacity (people)</label>
              <input
                id="edit-capacity"
                className="form-input"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
              />
            </div>

            {/* Cancellation */}
            <div className="form-field">
              <label className="form-label" htmlFor="edit-cancel">Cancellation Window (hrs)</label>
              <input
                id="edit-cancel"
                className="form-input"
                type="number"
                min="0"
                value={form.cancellationHours}
                onChange={(e) => updateField('cancellationHours', e.target.value)}
              />
            </div>

            {/* Public toggle */}
            <div className="form-field form-col-full">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => updateField('isPublic', e.target.checked)}
                  className="toggle-input"
                />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
                <span className="toggle-label">Publish Publicly</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link href="/offers" className="cancel-btn">Cancel</Link>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !form.name}
            >
              {isSubmitting ? (
                <span className="spinner" />
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-offer-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-width: 720px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
          text-decoration: none;
        }

        .back-link:hover {
          color: var(--text-brand);
        }

        .form-container {
          padding: var(--space-6);
        }

        .form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-6);
        }

        .delete-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid #fecaca;
          background: var(--bg-base);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-5);
        }

        .form-col-full {
          grid-column: 1 / -1;
        }

        .status-pills {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .status-pill {
          padding: var(--space-2) var(--space-4);
          border: 1.5px solid var(--border-default);
          border-radius: var(--radius-full);
          background: var(--bg-base);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .status-pill:hover {
          border-color: var(--color-navy-300);
        }

        .status-pill-active {
          background: var(--color-navy-700);
          color: var(--text-inverse);
          border-color: var(--color-navy-700);
        }

        .toggle-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          cursor: pointer;
        }

        .toggle-input {
          display: none;
        }

        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: var(--radius-full);
          background: var(--color-neutral-300);
          position: relative;
          transition: background var(--duration-fast) var(--ease-standard);
          flex-shrink: 0;
        }

        .toggle-input:checked + .toggle-track {
          background: var(--color-navy-700);
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: var(--shadow-xs);
          transition: transform var(--duration-fast) var(--ease-standard);
        }

        .toggle-input:checked + .toggle-track .toggle-thumb {
          transform: translateX(20px);
        }

        .toggle-label {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-heading);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          margin-top: var(--space-8);
          padding-top: var(--space-5);
          border-top: 1px solid var(--border-subtle);
        }

        .cancel-btn {
          padding: var(--space-3) var(--space-5);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
          text-decoration: none;
          background: var(--bg-app);
          border: 1px solid var(--border-subtle);
          transition: all var(--duration-fast) var(--ease-standard);
        }

        .cancel-btn:hover {
          background: var(--bg-section);
          color: var(--text-primary);
        }

        .submit-btn {
          padding: var(--space-3) var(--space-6);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          background: var(--action-primary-bg);
          color: var(--action-primary-text);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--space-2);
          transition: background var(--duration-fast) var(--ease-standard);
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--action-primary-bg-hover);
        }

        .submit-btn:disabled {
          background: var(--action-disabled-bg);
          color: var(--action-disabled-text);
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
