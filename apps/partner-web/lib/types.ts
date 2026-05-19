// Shared TypeScript types for the Partner Web App
// Mirrors Prisma schema enums and model shapes from BACKEND.md

export type PartnerStatus = 'PENDING_REVIEW' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
export type OfferType = 'CLASS' | 'DAY_PASS' | 'COURT_RESERVATION' | 'APPOINTMENT' | 'COURSE' | 'EVENT' | 'WORKSHOP';
export type OfferStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type SlotStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED' | 'PAST';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'REFUNDED';
export type TokenSource = 'PERSONAL' | 'CORPORATE' | 'BONUS';
export type SettlementStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'DISPUTED';

export interface Partner {
  id: string;
  businessName: string;
  businessType: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  district: string | null;
  coverImageUrl: string | null;
  logoUrl: string | null;
  contactEmail: string;
  contactPhone: string;
  lineId: string | null;
  settlementRate: number;
  bankAccountName: string | null;
  bankAccountNo: string | null;
  bankName: string | null;
  status: PartnerStatus;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  partnerId: string;
  name: string;
  type: OfferType;
  category: string;
  description: string | null;
  coverImageUrl: string | null;
  tokenPrice: number;
  durationMinutes: number | null;
  capacity: number | null;
  cancellationHours: number;
  isPublic: boolean;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  offerId: string;
  instructorName: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  availableCapacity: number;
  status: SlotStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  offer?: Offer;
}

export interface BookingUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface Booking {
  id: string;
  userId: string;
  partnerId: string;
  offerId: string;
  slotId: string;
  companyId: string | null;
  tokenUsed: number;
  tokenSource: TokenSource;
  status: BookingStatus;
  checkInCode: string;
  checkedInAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  noShowAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: BookingUser;
  offer?: Offer;
  slot?: Slot;
}

export interface SettlementReport {
  id: string;
  partnerId: string;
  periodStart: string;
  periodEnd: string;
  completedBookings: number;
  totalTokenValue: number;
  settlementRate: number;
  settlementAmount: number;
  status: SettlementStatus;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats
export interface PartnerDashboardStats {
  todayBookings: number;
  todayCheckIns: number;
  pendingBookings: number;
  totalTokensEarned: number;
  weeklyBookings: number[];
  recentBookings: Booking[];
}

// Form DTOs
export interface CreateOfferInput {
  name: string;
  type: OfferType;
  category: string;
  description?: string;
  tokenPrice: number;
  durationMinutes?: number;
  capacity?: number;
  cancellationHours?: number;
  isPublic?: boolean;
}

export interface UpdateOfferInput extends Partial<CreateOfferInput> {
  status?: OfferStatus;
}

export interface CreateSlotInput {
  instructorName?: string;
  startTime: string;
  endTime: string;
  capacity: number;
  notes?: string;
}

export interface RecurringSlotInput {
  instructorName?: string;
  startTime: string;
  endTime: string;
  capacity: number;
  daysOfWeek: number[];
  repeatWeeks: number;
  notes?: string;
}
