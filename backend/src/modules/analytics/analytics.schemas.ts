import { z } from 'zod';

export const MonthSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
});

export const PeriodSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export type MonthInput = z.infer<typeof MonthSchema>;
export type PeriodInput = z.infer<typeof PeriodSchema>;
