import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { endOfMonth, parsePeriod, startOfMonth } from '../../shared/utils/date';
import type { PeriodInput } from './analytics.schemas';
import type { CorporateAggregateStat, UserStats } from './analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserMonthlyStats(userId: string, month: string): Promise<UserStats> {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const [categoryGroups, bookings, partnerGroups] = await Promise.all([
      this.prisma.activityRecord.groupBy({
        by: ['category'],
        where: {
          userId,
          completedAt: { gte: start, lte: end },
        },
        _count: { id: true },
      }),
      this.prisma.booking.findMany({
        where: {
          userId,
          status: BookingStatus.COMPLETED,
          completedAt: { gte: start, lte: end },
        },
        select: {
          tokenUsed: true,
          completedAt: true,
        },
      }),
      this.prisma.booking.groupBy({
        by: ['partnerId'],
        where: {
          userId,
          status: BookingStatus.COMPLETED,
          completedAt: { gte: start, lte: end },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
    ]);

    const favoritePartner =
      partnerGroups[0] !== undefined
        ? await this.prisma.partner
            .findUnique({
              where: { id: partnerGroups[0].partnerId },
              select: { businessName: true },
            })
            .then((partner) =>
              partner === null
                ? null
                : {
                    name: partner.businessName,
                    visitCount: partnerGroups[0]?._count.id ?? 0,
                  },
            )
        : null;

    return {
      userId,
      period: month,
      totalActivities: bookings.length,
      totalTokensSpent: bookings.reduce((sum, booking) => sum + booking.tokenUsed, 0),
      categoryBreakdown: categoryGroups.map((group) => ({
        category: group.category,
        count: group._count.id,
      })),
      currentStreak: this.calculateCurrentStreak(bookings.map((booking) => booking.completedAt)),
      longestStreak: this.calculateLongestStreak(bookings.map((booking) => booking.completedAt)),
      favoritePartner,
    };
  }

  async getCorporateAggregateStats(
    companyId: string,
    periodInput: PeriodInput,
  ): Promise<CorporateAggregateStat[]> {
    const period = parsePeriod(periodInput.start, periodInput.end);
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        completedAt: { gte: period.start, lte: period.end },
        user: { employeeMembership: { companyId } },
      },
      select: {
        offer: { select: { category: true } },
        slot: { select: { startTime: true } },
      },
    });

    const aggregate = new Map<string, CorporateAggregateStat>();
    for (const booking of bookings) {
      const hourOfDay = booking.slot.startTime.getHours();
      const key = `${booking.offer.category}:${hourOfDay}`;
      const existing = aggregate.get(key) ?? {
        category: booking.offer.category,
        hourOfDay,
        bookingCount: 0,
      };
      existing.bookingCount += 1;
      aggregate.set(key, existing);
    }

    return [...aggregate.values()].sort((left, right) => right.bookingCount - left.bookingCount);
  }

  private calculateCurrentStreak(dates: Array<Date | null>): number {
    const days = this.uniqueDays(dates);
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  private calculateLongestStreak(dates: Array<Date | null>): number {
    const sorted = [...this.uniqueDays(dates)].sort();
    let longest = 0;
    let current = 0;
    let previous: Date | null = null;

    for (const day of sorted) {
      const date = new Date(`${day}T00:00:00.000Z`);
      if (previous === null) {
        current = 1;
      } else {
        const diffDays = (date.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
        current = diffDays === 1 ? current + 1 : 1;
      }
      longest = Math.max(longest, current);
      previous = date;
    }

    return longest;
  }

  private uniqueDays(dates: Array<Date | null>): Set<string> {
    return new Set(
      dates
        .filter((date): date is Date => date !== null)
        .map((date) => date.toISOString().slice(0, 10)),
    );
  }
}
