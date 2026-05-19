import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../api-client';

// ─── Types ──────────────────────────────────

interface CorporateDashboard {
  period: string;
  totalEmployees: number;
  activeEmployees: number;
  tokenUtilizationRate: number;
  totalTokensAllocated: number;
  totalTokensUsed: number;
  topCategories: Array<{ category: string; bookingCount: number; percentageOfTotal: number }>;
  departmentBreakdown: Array<{
    departmentId: string;
    departmentName: string;
    activeRate: number;
    topCategory: string;
  }>;
  popularTimeSlots: Array<{ hour: number; bookingCount: number }>;
}

interface DepartmentInsights {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  activeRate: number;
  topCategories: Array<{ category: string; bookingCount: number }>;
}

// ─── Dashboard ──────────────────────────────

export function useCorporateDashboard(companyId: string, start: string, end: string) {
  return useQuery({
    queryKey: ['corporate', 'dashboard', companyId, start, end],
    queryFn: () =>
      api.get<CorporateDashboard>(
        `/corporate/companies/${companyId}/dashboard?start=${start}&end=${end}`,
      ),
    enabled: !!companyId,
  });
}

// ─── Department Insights ────────────────────

export function useDepartmentInsights(
  companyId: string,
  departmentId: string,
  start: string,
  end: string,
) {
  return useQuery({
    queryKey: ['corporate', 'department', companyId, departmentId, start, end],
    queryFn: () =>
      api.get<DepartmentInsights>(
        `/corporate/companies/${companyId}/departments/${departmentId}/insights?start=${start}&end=${end}`,
      ),
    enabled: !!companyId && !!departmentId,
  });
}

// ─── Create Department ──────────────────────

export function useCreateDepartment(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api.post(`/corporate/companies/${companyId}/departments`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate'] });
    },
  });
}

// ─── Invite Employee ────────────────────────

export function useInviteEmployee(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; departmentId?: string }) =>
      api.post(`/corporate/companies/${companyId}/employees`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate'] });
    },
  });
}

// ─── Allocate Tokens ────────────────────────

export function useAllocateTokens(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { month: string; perEmployee: number }) =>
      api.post(`/corporate/companies/${companyId}/tokens/allocate`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate'] });
    },
  });
}
