import { z } from 'zod';

export const GenerateSettlementSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
});

export const MarkPaidSchema = z.object({
  notes: z.string().optional(),
});
