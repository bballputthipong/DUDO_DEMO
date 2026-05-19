// Date/time formatting utilities for the partner dashboard

/**
 * Format an ISO date string to a localized date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string to show time only
 */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format an ISO date string to a full date + time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a slot time range: "09:00 – 10:00"
 */
export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/**
 * Get a relative day label (today, tomorrow, or date)
 */
export function getRelativeDayLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'dayนี้';
  if (date.toDateString() === tomorrow.toDateString()) return 'พรุ่งนี้';
  return formatDate(dateString);
}

/**
 * Human-readable booking status labels (Thai)
 */
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'PendingConfirm',
  CONFIRMED: 'ConfirmDone',
  CHECKED_IN: 'Check-inDone',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'CancelDone',
  NO_SHOW: 'NotมาUseบริการ',
  REFUNDED: 'คืนเงินDone',
};

/**
 * Human-readable offer type labels (Thai)
 */
export const OFFER_TYPE_LABELS: Record<string, string> = {
  CLASS: 'Class',
  DAY_PASS: 'Day Pass',
  COURT_RESERVATION: 'bookingสนาม',
  APPOINTMENT: 'นัดหมาย',
  COURSE: 'คอร์ส',
  EVENT: 'อีเวนต์',
  WORKSHOP: 'เวิร์กชอป',
};

/**
 * Human-readable offer status labels (Thai)
 */
export const OFFER_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'แบบร่าง',
  ACTIVE: 'Useงานอยู่',
  PAUSED: 'หยุดชั่วคราว',
  ARCHIVED: 'เก็บถาวร',
};

/**
 * Human-readable settlement status labels (Thai)
 */
export const SETTLEMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'PendingProcessing',
  PROCESSING: 'Processing',
  COMPLETED: 'ชำระDone',
  DISPUTED: 'Hasข้อโต้แย้ง',
};

/**
 * Format token amount with separator
 */
export function formatTokens(amount: number): string {
  return amount.toLocaleString('th-TH');
}

/**
 * Format THB currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Category labels for wellness activities
 */
export const CATEGORY_OPTIONS = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'พิลาทิส' },
  { value: 'boxing', label: 'Boxing / Boxing' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'gym', label: 'Fitness' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'spa', label: 'สปา' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'dance', label: 'เต้น' },
  { value: 'martial_arts', label: 'ศิลปะป้องกันตัว' },
  { value: 'outdoor', label: 'ActivityMediumแจ้ง' },
  { value: 'other', label: 'อื่นๆ' },
];
