import { create } from "zustand";

import type { Booking, BookingDraft } from "@/src/types/domain";

interface BookingState {
  draft: BookingDraft | null;
  recentBooking: Booking | null;
  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
  setRecentBooking: (booking: Booking) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  draft: null,
  recentBooking: null,
  setDraft: (draft) => {
    set({ draft });
  },
  clearDraft: () => {
    set({ draft: null });
  },
  setRecentBooking: (booking) => {
    set({ recentBooking: booking });
  },
}));
