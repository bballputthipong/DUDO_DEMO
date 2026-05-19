import { AdminActionType, TokenSource } from '@prisma/client';
import { z } from 'zod';

export const AdminUserFilterSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const ReasonSchema = z.object({
  reason: z.string().min(1),
  adminId: z.string().min(1),
});

export const AdminIdSchema = z.object({
  adminId: z.string().min(1),
});

export const AdjustTokenSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int(),
  source: z.nativeEnum(TokenSource),
  reason: z.string().min(1),
  adminId: z.string().min(1),
});

export const AdminLogFilterSchema = z.object({
  type: z.nativeEnum(AdminActionType).optional(),
  targetEntity: z.string().optional(),
  targetId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type AdminUserFilterInput = z.infer<typeof AdminUserFilterSchema>;
export type AdminLogFilterInput = z.infer<typeof AdminLogFilterSchema>;
