import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  BookingStatus,
  PartnerStatus,
  SettlementReport,
  SettlementStatus,
} from '@prisma/client';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { currentMonth, endOfMonth, startOfMonth } from '../../shared/utils/date';

@Injectable()
export class SettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async runMonthlySettlementCron(): Promise<void> {
    await this.generateMonthlySettlements(currentMonth());
  }

  async generateMonthlySettlements(month: string): Promise<void> {
    const periodStart = startOfMonth(month);
    const periodEnd = endOfMonth(month);
    const partners = await this.prisma.partner.findMany({
      where: { status: PartnerStatus.ACTIVE },
    });

    for (const partner of partners) {
      const completedBookings = await this.prisma.booking.findMany({
        where: {
          partnerId: partner.id,
          status: BookingStatus.COMPLETED,
          completedAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        include: { offer: true },
      });

      const totalTokenValue = completedBookings.reduce(
        (sum, booking) => sum + booking.tokenUsed,
        0,
      );
      const tokenThbRate = Number(this.configService.get<string>('TOKEN_THB_RATE') ?? 8);
      const grossAmount = totalTokenValue * tokenThbRate;
      const settlementAmount = grossAmount * Number(partner.settlementRate);

      await this.prisma.settlementReport.create({
        data: {
          partnerId: partner.id,
          periodStart,
          periodEnd,
          completedBookings: completedBookings.length,
          totalTokenValue,
          settlementRate: partner.settlementRate,
          settlementAmount,
          status: SettlementStatus.PENDING,
        },
      });
    }
  }

  async listPartnerReports(partnerId: string): Promise<SettlementReport[]> {
    return this.prisma.settlementReport.findMany({
      where: { partnerId },
      orderBy: { periodStart: 'desc' },
    });
  }

  async listReports(): Promise<SettlementReport[]> {
    return this.prisma.settlementReport.findMany({
      include: { partner: true },
      orderBy: { periodStart: 'desc' },
    });
  }

  async markPaid(reportId: string, notes?: string): Promise<SettlementReport> {
    return this.prisma.settlementReport.update({
      where: { id: reportId },
      data: {
        status: SettlementStatus.COMPLETED,
        paidAt: new Date(),
        notes,
      },
    });
  }
}
