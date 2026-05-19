import type { BookingStatus } from '@/lib/types';
import { BOOKING_STATUS_LABELS } from '@/lib/utils';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const STATUS_CLASS_MAP: Record<BookingStatus, string> = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-confirmed',
  CHECKED_IN: 'status-checked-in',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
  NO_SHOW: 'status-no-show',
  REFUNDED: 'status-refunded',
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span className={`status-badge status-badge-dot ${STATUS_CLASS_MAP[status]}`}>
      {BOOKING_STATUS_LABELS[status] || status}
    </span>
  );
}
