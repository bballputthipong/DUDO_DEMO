import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBooking,
  fetchActivities,
  fetchActivity,
  fetchBookings,
  fetchWallet,
  login,
  signup,
  type LoginPayload,
  type SignupPayload,
} from "@/src/api/user-api";
import type { BookingDraft } from "@/src/types/domain";

export function useActivitiesQuery() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });
}

export function useActivityQuery(activityId: string) {
  return useQuery({
    queryKey: ["activities", activityId],
    queryFn: () => fetchActivity(activityId),
    enabled: activityId.length > 0,
  });
}

export function useWalletQuery(userId: string) {
  return useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => fetchWallet(userId),
    enabled: userId.length > 0,
  });
}

export function useBookingsQuery(userId: string) {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: () => fetchBookings(userId),
    enabled: userId.length > 0,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: BookingDraft) => createBooking(draft),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
