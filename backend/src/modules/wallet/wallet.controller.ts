import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import {
  AdminAdjustSchema,
  CreditBonusSchema,
  CreditCorporateSchema,
  CreditPersonalSchema,
  PaginationSchema,
} from './wallet.schemas';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId/balance')
  getBalance(@Param('userId') userId: string): ReturnType<WalletService['getBalance']> {
    return this.walletService.getBalance(userId);
  }

  @Get(':userId/transactions')
  getTransactions(
    @Param('userId') userId: string,
    @Query() query: unknown,
  ): ReturnType<WalletService['getTransactionHistory']> {
    return this.walletService.getTransactionHistory(userId, PaginationSchema.parse(query));
  }

  @Post('credit/personal')
  creditPersonal(@Body() body: unknown): ReturnType<WalletService['creditPersonal']> {
    const input = CreditPersonalSchema.parse(body);
    return this.walletService.creditPersonal(input.userId, input.amount, input.description);
  }

  @Post('credit/corporate')
  creditCorporate(@Body() body: unknown): ReturnType<WalletService['creditCorporate']> {
    const input = CreditCorporateSchema.parse(body);
    return this.walletService.creditCorporate(input.userId, input.companyId, input.amount);
  }

  @Post('credit/bonus')
  creditBonus(@Body() body: unknown): ReturnType<WalletService['creditBonus']> {
    const input = CreditBonusSchema.parse(body);
    return this.walletService.creditBonus(
      input.userId,
      input.amount,
      input.expiresAt,
      input.description,
    );
  }

  @Post('admin-adjust')
  adminAdjust(@Body() body: unknown): ReturnType<WalletService['adminAdjust']> {
    const input = AdminAdjustSchema.parse(body);
    return this.walletService.adminAdjust(
      input.userId,
      input.amount,
      input.source,
      input.reason,
      input.adminId,
    );
  }
}
