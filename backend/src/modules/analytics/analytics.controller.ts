import { Controller, Get, Param, Query } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { MonthSchema, PeriodSchema } from './analytics.schemas';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('users/:userId/monthly')
  getUserMonthlyStats(
    @Param('userId') userId: string,
    @Query() query: unknown,
  ): ReturnType<AnalyticsService['getUserMonthlyStats']> {
    const input = MonthSchema.parse(query);
    return this.analyticsService.getUserMonthlyStats(userId, input.month);
  }

  @Get('corporate/:companyId/aggregate')
  getCorporateAggregateStats(
    @Param('companyId') companyId: string,
    @Query() query: unknown,
  ): ReturnType<AnalyticsService['getCorporateAggregateStats']> {
    return this.analyticsService.getCorporateAggregateStats(companyId, PeriodSchema.parse(query));
  }
}
