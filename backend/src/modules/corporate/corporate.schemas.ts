import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  emailDomain: z.string().min(3).transform((value) => value.toLowerCase()),
  logoUrl: z.string().url().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  contactEmail: z.string().email(),
});

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1),
});

export const InviteEmployeeSchema = z.object({
  email: z.string().email(),
  departmentId: z.string().min(1).optional(),
});

export const VerifyEmployeeSchema = z.object({
  token: z.string().min(1),
});

export const AllocateTokensSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  perEmployee: z.number().int().positive(),
});

export const PeriodSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type PeriodInput = z.infer<typeof PeriodSchema>;
