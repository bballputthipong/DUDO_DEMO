'use client';

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import type { OfferType } from '@/lib/types';
import { OFFER_TYPE_LABELS, CATEGORY_OPTIONS } from '@/lib/utils';

const OFFER_TYPES: OfferType[] = [
  'CLASS', 'DAY_PASS', 'COURT_RESERVATION', 'APPOINTMENT', 'COURSE', 'EVENT', 'WORKSHOP',
];

export default function NewOfferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'CLASS' as OfferType,
    category: '',
    description: '',
    tokenPrice: '',
    durationMinutes: '',
    capacity: '',
    cancellationHours: '24',
    isPublic: true,
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push('/offers');
  }

  return (
    <div className="new-offer-page">
      <Link href="/offers" className="back-link">
        <ArrowLeft size={18} />
        Back to offers
      </Link>

      <div className="form-container dashboard-card">
        <h2 style={{ margin: '0 0 var(--space-1) 0' }}>Create New Offer</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', margin: '0 0 var(--space-6) 0' }}>
          Fill in details to create a new class, activity, or service
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Name */}
            <div className="form-field form-col-full">
              <label className="form-label" htmlFor="offer-name">Offer Name *</label>
              <input
                id="offer-name"
                className="form-input"
                placeholder="e.g. Morning Yoga Flow"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>

            {/* Type */}
            <div className="form-field">
              <label className="form-label" htmlFor="offer-type">Type *</label>
              <select
                id="offer-type"
                className="form-input"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
                required
              >
                {OFFER_TYPES.map((t) => (
                  <option key={t} value={t}>{OFFER_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="form-field">
              <label className="form-label" htmlFor="offer-category">Category *</label>
              <select
                id="offer-category"
                className="form-input"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-field form-col-full">
              <label className="form-label" htmlFor="offer-description">Details</label>
              <textarea
                id="offer-description"
                className="form-input"
                rows={3}
                placeholder="Describe your activity..."
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Token Price */}
            <div className="form-field">
              <label className="form-label" htmlFor="offer-price">Price (Token) *</label>
              <input
                id="offer-price"
                className="form-input"
                type="number"
                min="1"
                placeholder="5"
                value={form.tokenPrice}
                onChange={(e) => updateField('tokenPrice', e.target.value)}
                required
              />
              <span className="form-hint">Number of tokens required per booking</span>
            </div>

            {/* Duration */}
            <div className="form-field">
              <label className="form-label" htmlFor="offer-duration">Duration (minutes)</label>
              <input
                id="offer-duration"
                className="form-input"
                type="number"
                min="15"
                step="5"
                placeholder="60"
                value={form.durationMinutes}
                onChange={(e) => updateField('durationMinutes', e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div className="form-field">
              <label className="form-label" htmlFor="offer-capacity">Capacity (people)</label>
              <input
                id="offer-capacity"
                className="form-input"
                type="number"
                min="1"
                placeholder="20"
                value={form.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
              />
            </div>

            {/* Cancellation Hours */}
            <div className="form-field">
              <label className="form-label" htmlFor="offer-cancel">Cancellation Window (hours)</label>
              <input
                id="offer-cancel"
                className="form-input"
                type="number"
                min="0"
                value={form.cancellationHours}
                onChange={(e) => updateField('cancellationHours', e.target.value)}
              />
              <span className="form-hint">Minimum time before activity starts</span>
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
              <span className="form-hint">When enabled, this offer will appear on the customer app</span>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link href="/offers" className="cancel-btn">Cancel</Link>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !form.name || !form.category || !form.tokenPrice}
            >
              {isSubmitting ? (
                <span className="spinner" />
              ) : (
                <>
                  <Save size={16} />
                  Create Offer
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .new-offer-page {
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
          transition: color var(--duration-fast) var(--ease-standard);
        }

        .back-link:hover {
          color: var(--text-brand);
        }

        .form-container {
          padding: var(--space-6);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-5);
        }

        .form-col-full {
          grid-column: 1 / -1;
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
