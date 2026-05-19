// React Query hooks for Partner API endpoints

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../api-client';
import type {
  Booking,
  BookingStatus,
  CreateOfferInput,
  CreateSlotInput,
  Offer,
  Partner,
  PartnerDashboardStats,
  RecurringSlotInput,
  SettlementReport,
  Slot,
  UpdateOfferInput,
} from '../types';

// ── Partner Profile ──

export function usePartnerProfile(partnerId: string) {
  return useQuery({
    queryKey: ['partner', partnerId],
    queryFn: () => api.get<Partner>(`/partners/${partnerId}`).then((r) => r.data),
    enabled: Boolean(partnerId),
  });
}

// ── Dashboard Stats ──

export function useDashboardStats(partnerId: string) {
  return useQuery({
    queryKey: ['partner-dashboard', partnerId],
    queryFn: () =>
      api.get<PartnerDashboardStats>(`/partners/${partnerId}/dashboard`).then((r) => r.data),
    enabled: Boolean(partnerId),
    refetchInterval: 30_000, // refresh every 30s for live dashboard
  });
}

// ── Bookings ──

export function usePartnerBookings(partnerId: string, status?: BookingStatus) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);

  return useQuery({
    queryKey: ['partner-bookings', partnerId, status],
    queryFn: () =>
      api.get<Booking[]>(`/partners/${partnerId}/bookings?${params.toString()}`).then((r) => r.data),
    enabled: Boolean(partnerId),
  });
}

export function useBookingDetail(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => api.get<Booking>(`/bookings/${bookingId}`).then((r) => r.data),
    enabled: Boolean(bookingId),
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, partnerId }: { code: string; partnerId: string }) =>
      api.post<Booking>(`/api/v1/check-in/${code}`, { partnerId }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partner-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['partner-dashboard'] });
    },
  });
}

export function useMarkCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, partnerId }: { bookingId: string; partnerId: string }) =>
      api.post<Booking>(`/bookings/${bookingId}/complete`, { partnerId }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partner-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['partner-dashboard'] });
    },
  });
}

export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, partnerId }: { bookingId: string; partnerId: string }) =>
      api.post<Booking>(`/bookings/${bookingId}/no-show`, { partnerId }).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partner-bookings'] });
    },
  });
}

// ── Offers ──

export function usePartnerOffers(partnerId: string) {
  return useQuery({
    queryKey: ['partner-offers', partnerId],
    queryFn: () => api.get<Offer[]>(`/partners/${partnerId}/offers`).then((r) => r.data),
    enabled: Boolean(partnerId),
  });
}

export function useOfferDetail(offerId: string) {
  return useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => api.get<Offer>(`/offers/${offerId}`).then((r) => r.data),
    enabled: Boolean(offerId),
  });
}

export function useCreateOffer(partnerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOfferInput) =>
      api.post<Offer>(`/partners/${partnerId}/offers`, data).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partner-offers', partnerId] });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ offerId, data }: { offerId: string; data: UpdateOfferInput }) =>
      api.patch<Offer>(`/offers/${offerId}`, data).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['partner-offers'] });
      void queryClient.invalidateQueries({ queryKey: ['offer'] });
    },
  });
}

// ── Slots ──

export function useOfferSlots(offerId: string) {
  return useQuery({
    queryKey: ['offer-slots', offerId],
    queryFn: () => api.get<Slot[]>(`/offers/${offerId}/slots`).then((r) => r.data),
    enabled: Boolean(offerId),
  });
}

export function useCreateSlot(offerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSlotInput) =>
      api.post<Slot>(`/offers/${offerId}/slots`, data).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offer-slots', offerId] });
    },
  });
}

export function useCreateRecurringSlots(offerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecurringSlotInput) =>
      api.post<Slot[]>(`/offers/${offerId}/slots/recurring`, data).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offer-slots', offerId] });
    },
  });
}

export function useCancelSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => api.delete<void>(`/slots/${slotId}`).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offer-slots'] });
    },
  });
}

// ── Settlements ──

export function usePartnerSettlements(partnerId: string) {
  return useQuery({
    queryKey: ['partner-settlements', partnerId],
    queryFn: () =>
      api.get<SettlementReport[]>(`/partners/${partnerId}/settlements`).then((r) => r.data),
    enabled: Boolean(partnerId),
  });
}

// ── Check-in by code ──

export function useBookingByCheckInCode(code: string) {
  return useQuery({
    queryKey: ['check-in-code', code],
    queryFn: () => api.get<Booking>(`/partners/check-in/${code}`).then((r) => r.data),
    enabled: code.length >= 4,
    retry: false,
  });
}
