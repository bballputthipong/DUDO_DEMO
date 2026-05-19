import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { GenerateSettlementSchema, MarkPaidSchema } from './settlement.schemas';
import { SettlementService } from './settlement.service';

@Controller('settlement')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Post('generate')
  generateMonthlySettlements(
    @Body() body: unknown,
  ): ReturnType<SettlementService['generateMonthlySettlements']> {
    const input = GenerateSettlementSchema.parse(body);
    return this.settlementService.generateMonthlySettlements(input.month);
  }

  @Get()
  listReports(): ReturnType<SettlementService['listReports']> {
    return this.settlementService.listReports();
  }

  @Get('partners/:partnerId')
  listPartnerReports(
    @Param('partnerId') partnerId: string,
  ): ReturnType<SettlementService['listPartnerReports']> {
    return this.settlementService.listPartnerReports(partnerId);
  }

  @Patch(':reportId/paid')
  markPaid(
    @Param('reportId') reportId: string,
    @Body() body: unknown,
  ): ReturnType<SettlementService['markPaid']> {
    const input = MarkPaidSchema.parse(body);
    return this.settlementService.markPaid(reportId, input.notes);
  }
}
