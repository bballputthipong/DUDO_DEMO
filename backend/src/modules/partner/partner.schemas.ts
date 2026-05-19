import { OfferStatus, OfferType, PartnerStatus } from '@prisma/client';
import { z } from 'zod';

export const CreatePartnerSchema = z.object({
  businessName: z.string().min(1),
  businessType: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  district: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(6),
  lineId: z.string().optional(),
  settlementRate: z.number().min(0).max(1).optional(),
  bankAccountName: z.string().optional(),
  bankAccountNo: z.string().optional(),
  bankName: z.string().optional(),
  status: z.nativeEnum(PartnerStatus).optional(),
});

export const UpdatePartnerSchema = CreatePartnerSchema.partial();

export const CreateOfferSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(OfferType),
  category: z.string().min(1),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  tokenPrice: z.number().int().positive(),
  durationMinutes: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  cancellationHours: z.number().int().min(0).default(24),
  isPublic: z.boolean().default(true),
  status: z.nativeEnum(OfferStatus).default(OfferStatus.DRAFT),
});

export const UpdateOfferSchema = CreateOfferSchema.partial();

export const CreateSlotSchema = z.object({
  instructorName: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  capacity: z.number().int().positive(),
  availableCapacity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const RecurringSlotSchema = z.object({
  instructorName: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  capacity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const BookingFilterSchema = z.object({
  status: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type CreatePartnerInput = z.infer<typeof CreatePartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof UpdatePartnerSchema>;
export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferInput = z.infer<typeof UpdateOfferSchema>;
export type CreateSlotInput = z.infer<typeof CreateSlotSchema>;
export type RecurringSlotInput = z.infer<typeof RecurringSlotSchema>;
export type BookingFilterInput = z.infer<typeof BookingFilterSchema>;
