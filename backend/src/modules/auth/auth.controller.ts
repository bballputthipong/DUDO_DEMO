import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  LoginSchema,
  RefreshSchema,
  SignupSchema,
  VerifyCorporateEmailSchema,
  VerifyOtpSchema,
} from './auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: unknown): ReturnType<AuthService['signup']> {
    return this.authService.signup(SignupSchema.parse(body));
  }

  @Post('login')
  login(@Body() body: unknown): ReturnType<AuthService['login']> {
    return this.authService.login(LoginSchema.parse(body));
  }

  @Post('refresh')
  refresh(@Body() body: unknown): ReturnType<AuthService['refresh']> {
    return this.authService.refresh(RefreshSchema.parse(body));
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: unknown): ReturnType<AuthService['verifyOtp']> {
    return this.authService.verifyOtp(VerifyOtpSchema.parse(body));
  }

  @Post('verify-corporate-email')
  verifyCorporateEmail(
    @Body() body: unknown,
  ): ReturnType<AuthService['verifyCorporateEmail']> {
    return this.authService.verifyCorporateEmail(VerifyCorporateEmailSchema.parse(body));
  }
}
