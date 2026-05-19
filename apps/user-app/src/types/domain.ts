export type ActivityCategory = "Yoga" | "Pilates" | "Fitness" | "Spa" | "Mindfulness";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface ActivitySlot {
  id: string;
  startsAt: string;
  endsAt: string;
  dateLabel: string;
  timeLabel: string;
  availableSpots: number;
  isAvailable: boolean;
}

export interface WellnessActivity {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  category: ActivityCategory;
  location: string;
  distanceKm: number;
  durationMinutes: number;
  tokenPrice: number;
  rating: number;
  imageUrl: string;
  description: string;
  benefits: string[];
  slots: ActivitySlot[];
}

export type BookingStatus = "confirmed" | "checked-in" | "completed" | "cancelled" | "no-show";

export interface Booking {
  id: string;
  activityId: string;
  activityTitle: string;
  partnerName: string;
  imageUrl: string;
  status: BookingStatus;
  startsAt: string;
  timeLabel: string;
  tokenUsed: number;
  checkInCode: string;
}

export interface WalletBalance {
  personal: number;
  corporate: number;
  bonus: number;
  total: number;
}

export interface WalletTransaction {
  id: string;
  label: string;
  source: "personal" | "corporate" | "bonus";
  amount: number;
  createdAt: string;
}

export interface WalletSnapshot {
  balance: WalletBalance;
  transactions: WalletTransaction[];
}

export interface BookingDraft {
  activityId: string;
  slotId: string;
}
