import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6).optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(1),
});

export const LoginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  password: z.string().min(8).optional(),
  otp: z.string().length(6).optional(),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const VerifyOtpSchema = z.object({
  target: z.string().min(3),
  otp: z.string().length(6),
});

export const VerifyCorporateEmailSchema = z.object({
  userId: z.string().min(1),
  corporateEmail: z.string().email(),
  otp: z.string().length(6).optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type VerifyCorporateEmailInput = z.infer<typeof VerifyCorporateEmailSchema>;
