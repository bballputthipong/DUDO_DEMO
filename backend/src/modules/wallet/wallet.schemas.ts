import { TokenSource } from '@prisma/client';
import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const CreditPersonalSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int().positive(),
  description: z.string().min(1),
});

export const CreditCorporateSchema = z.object({
  userId: z.string().min(1),
  companyId: z.string().min(1),
  amount: z.number().int().positive(),
});

export const CreditBonusSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int().positive(),
  expiresAt: z.coerce.date(),
  description: z.string().min(1),
});

export const AdminAdjustSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int(),
  source: z.nativeEnum(TokenSource),
  reason: z.string().min(1),
  adminId: z.string().min(1),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
