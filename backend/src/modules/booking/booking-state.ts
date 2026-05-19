import { BookingStatus } from '@prisma/client';

import { InvalidBookingTransitionError } from '../../shared/errors/app-error';

export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [
    BookingStatus.CHECKED_IN,
    BookingStatus.CANCELLED,
    BookingStatus.NO_SHOW,
  ],
  [BookingStatus.CHECKED_IN]: [BookingStatus.COMPLETED],
  [BookingStatus.COMPLETED]: [BookingStatus.REFUNDED],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.NO_SHOW]: [],
  [BookingStatus.REFUNDED]: [],
};

export function assertValidTransition(from: BookingStatus, to: BookingStatus): void {
  if (!VALID_TRANSITIONS[from].includes(to)) {
    throw new InvalidBookingTransitionError(from, to);
  }
}
