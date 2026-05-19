import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../api-client';

// ─── Types ──────────────────────────────────

interface PlatformStats {
  totalUsers: number;
  totalPartners: number;
  totalBookings: number;
  totalTokensCirculating: number;
  monthlyActiveUsers: number;
  pendingApprovals: number;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface PartnerRecord {
  id: string;
  businessName: string;
  type: string;
  status: string;
  offersCount: number;
  rating: number;
}

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

// ─── Platform Stats ─────────────────────────

export function usePlatformStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<PlatformStats>('/admin/stats'),
  });
}

// ─── Users ──────────────────────────────────

export function useAdminUsers(page = 1, search = '') {
  return useQuery({
    queryKey: ['admin', 'users', page, search],
    queryFn: () =>
      api.get<UserRecord[]>(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post(`/admin/users/${userId}/suspend`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useReactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post(`/admin/users/${userId}/reactivate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

// ─── Partners ───────────────────────────────

export function useAdminPartners(page = 1) {
  return useQuery({
    queryKey: ['admin', 'partners', page],
    queryFn: () => api.get<PartnerRecord[]>(`/admin/partners?page=${page}`),
  });
}

export function useApprovePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (partnerId: string) => api.post(`/admin/partners/${partnerId}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin'] }),
  });
}

export function useRejectPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { partnerId: string; reason?: string }) =>
      api.post(`/admin/partners/${data.partnerId}/reject`, { reason: data.reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin'] }),
  });
}

// ─── Audit Log ──────────────────────────────

export function useAuditLog(page = 1) {
  return useQuery({
    queryKey: ['admin', 'audit', page],
    queryFn: () => api.get<AuditLogEntry[]>(`/admin/audit?page=${page}`),
  });
}
