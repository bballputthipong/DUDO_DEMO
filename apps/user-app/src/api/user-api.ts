import { activities, bookings, walletSnapshot } from "@/src/data/mock-data";
import type {
  AuthSession,
  Booking,
  BookingDraft,
  UserProfile,
  WalletSnapshot,
  WellnessActivity,
} from "@/src/types/domain";

const latencyMs = 360;

function wait(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, latencyMs);
  });
}

function createCheckInCode(): string {
  const value = Math.floor(1000 + Math.random() * 9000);
  return `DUDO-${value}`;
}

export interface LoginPayload {
  target: string;
  otp: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  await wait();

  if (payload.target.trim().length < 3 || payload.otp.trim().length < 4) {
    throw new Error("Please enter a valid email/phone and OTP");
  }

  const user: UserProfile = {
    id: "user-demo",
    name: "DUDO Member",
    email: payload.target.includes("@") ? payload.target : "member@dudo.app",
    phone: payload.target.includes("@") ? undefined : payload.target,
    isVerified: true,
  };

  return {
    user,
    tokens: {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
    },
  };
}

export async function signup(payload: SignupPayload): Promise<AuthSession> {
  await wait();

  if (payload.name.trim().length < 2 || payload.email.trim().length < 5) {
    throw new Error("Please enter your name and email to sign up");
  }

  return {
    user: {
      id: "user-demo",
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      isVerified: false,
    },
    tokens: {
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
    },
  };
}

export async function fetchActivities(): Promise<WellnessActivity[]> {
  await wait();
  return activities;
}

export async function fetchActivity(activityId: string): Promise<WellnessActivity> {
  await wait();
  const activity = activities.find((item) => item.id === activityId);

  if (activity === undefined) {
    throw new Error("Activity not found");
  }

  return activity;
}

export async function fetchWallet(_userId: string): Promise<WalletSnapshot> {
  await wait();
  return walletSnapshot;
}

export async function fetchBookings(_userId: string): Promise<Booking[]> {
  await wait();
  return bookings;
}

export async function createBooking(draft: BookingDraft): Promise<Booking> {
  await wait();

  const activity = activities.find((item) => item.id === draft.activityId);
  const slot = activity?.slots.find((item) => item.id === draft.slotId);

  if (activity === undefined || slot === undefined) {
    throw new Error("Selected time slot not found");
  }

  if (!slot.isAvailable) {
    throw new Error("This time slot is full. Please choose another time.");
  }

  return {
    id: `booking-${Date.now()}`,
    activityId: activity.id,
    activityTitle: activity.title,
    partnerName: activity.partnerName,
    imageUrl: activity.imageUrl,
    status: "confirmed",
    startsAt: slot.startsAt,
    timeLabel: slot.timeLabel,
    tokenUsed: activity.tokenPrice,
    checkInCode: createCheckInCode(),
  };
}
