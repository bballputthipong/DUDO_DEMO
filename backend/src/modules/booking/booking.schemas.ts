import { BookingStatus, TokenSource } from '@prisma/client';
import { z } from 'zod';

export const CreateBookingSchema = z.object({
  userId: z.string().min(1),
  offerId: z.string().min(1),
  slotId: z.string().min(1),
  tokenSource: z.nativeEnum(TokenSource),
  companyId: z.string().min(1).optional(),
});

export const PartnerActionSchema = z.object({
  partnerId: z.string().min(1),
});

export const CancelBookingSchema = z.object({
  reason: z.string().min(1),
});

export const AdminRefundSchema = z.object({
  adminId: z.string().min(1),
});

export const BookingHistoryQuerySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
