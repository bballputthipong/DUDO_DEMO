import { Injectable } from '@nestjs/common';
import {
  BookingStatus,
  Company,
  Department,
  EmployeeMembership,
  EmployeeStatus,
  UserRole,
} from '@prisma/client';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { parsePeriod } from '../../shared/utils/date';
import { WalletService } from '../wallet/wallet.service';
import type { CreateCompanyInput, PeriodInput } from './corporate.schemas';
import type { CorporateDashboard, DepartmentInsights } from './corporate.types';

@Injectable()
export class CorporateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  async createCompany(data: CreateCompanyInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async createDepartment(companyId: string, name: string): Promise<Department> {
    return this.prisma.department.create({
      data: { companyId, name },
    });
  }

  async inviteEmployee(
    companyId: string,
    email: string,
    departmentId?: string,
  ): Promise<{ invited: true; token: string }> {
    const membership = await this.prisma.employeeMembership.create({
      data: {
        user: {
          create: {
            email,
            name: email.split('@')[0] ?? email,
            role: UserRole.USER,
            wallet: { create: {} },
            profile: {
              create: {
                preferredCategories: [],
                wellnessGoals: [],
              },
            },
          },
        },
        company: { connect: { id: companyId } },
        department:
          departmentId === undefined ? undefined : { connect: { id: departmentId } },
        corporateEmail: email,
        status: EmployeeStatus.PENDING_VERIFICATION,
      },
    });

    return { invited: true, token: membership.id };
  }

  async verifyEmployeeEmail(token: string): Promise<EmployeeMembership> {
    return this.prisma.employeeMembership.update({
      where: { id: token },
      data: {
        isEmailVerified: true,
        status: EmployeeStatus.ACTIVE,
      },
    });
  }

  async allocateTokens(companyId: string, month: string, perEmployee: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const employees = await tx.employeeMembership.findMany({
        where: { companyId, status: EmployeeStatus.ACTIVE },
      });
      const totalTokens = employees.length * perEmployee;

      await tx.corporateTokenAllocation.upsert({
        where: { companyId_month: { companyId, month } },
        update: { totalTokens: { increment: totalTokens } },
        create: { companyId, month, totalTokens },
      });

      for (const employee of employees) {
        await this.walletService.creditCorporate(employee.userId, companyId, perEmployee, tx);
        await tx.employeeMembership.update({
          where: { id: employee.id },
          data: { monthlyTokenAllowance: perEmployee },
        });
      }
    });
  }

  async getDashboard(companyId: string, periodInput: PeriodInput): Promise<CorporateDashboard> {
    const period = parsePeriod(periodInput.start, periodInput.end);
    const periodLabel = `${periodInput.start}/${periodInput.end}`;

    const totalEmployees = await this.prisma.employeeMembership.count({
      where: { companyId, status: EmployeeStatus.ACTIVE },
    });

    const allocation = await this.prisma.corporateTokenAllocation.aggregate({
      where: { companyId },
      _sum: { totalTokens: true, usedTokens: true },
    });

    const completedBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        completedAt: { gte: period.start, lte: period.end },
        user: { employeeMembership: { companyId } },
      },
      include: {
        offer: { select: { category: true } },
        slot: { select: { startTime: true } },
        user: {
          select: {
            employeeMembership: {
              select: {
                departmentId: true,
                department: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const activeEmployees = await this.prisma.booking
      .groupBy({
        by: ['userId'],
        where: {
          status: BookingStatus.COMPLETED,
          completedAt: { gte: period.start, lte: period.end },
          user: { employeeMembership: { companyId } },
        },
      })
      .then((groups) => groups.length);

    const totalTokensUsed = completedBookings.reduce((sum, booking) => sum + booking.tokenUsed, 0);
    const categoryCounts = new Map<string, number>();
    const hourCounts = new Map<number, number>();
    const departmentActivity = new Map<string, { name: string; count: number; top: Map<string, number> }>();

    for (const booking of completedBookings) {
      const category = booking.offer.category;
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
      const hour = booking.slot.startTime.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
      const membership = booking.user.employeeMembership;
      const departmentId = membership?.departmentId;
      if (departmentId !== null && departmentId !== undefined) {
        const current = departmentActivity.get(departmentId) ?? {
          name: membership?.department?.name ?? 'Unknown',
          count: 0,
          top: new Map<string, number>(),
        };
        current.count += 1;
        current.top.set(category, (current.top.get(category) ?? 0) + 1);
        departmentActivity.set(departmentId, current);
      }
    }

    const bookingTotal = completedBookings.length || 1;
    return {
      period: periodLabel,
      totalEmployees,
      activeEmployees,
      tokenUtilizationRate:
        (allocation._sum.totalTokens ?? 0) === 0
          ? 0
          : (totalTokensUsed / (allocation._sum.totalTokens ?? 1)) * 100,
      totalTokensAllocated: allocation._sum.totalTokens ?? 0,
      totalTokensUsed,
      topCategories: [...categoryCounts.entries()].map(([category, bookingCount]) => ({
        category,
        bookingCount,
        percentageOfTotal: (bookingCount / bookingTotal) * 100,
      })),
      departmentBreakdown: [...departmentActivity.entries()].map(([departmentId, item]) => ({
        departmentId,
        departmentName: item.name,
        activeRate: totalEmployees === 0 ? 0 : (item.count / totalEmployees) * 100,
        topCategory: this.topEntry(item.top) ?? 'none',
      })),
      popularTimeSlots: [...hourCounts.entries()].map(([hour, bookingCount]) => ({
        hour,
        bookingCount,
      })),
    };
  }

  async getDepartmentInsights(
    companyId: string,
    departmentId: string,
    periodInput: PeriodInput,
  ): Promise<DepartmentInsights> {
    const period = parsePeriod(periodInput.start, periodInput.end);
    const department = await this.prisma.department.findFirstOrThrow({
      where: { id: departmentId, companyId },
    });
    const totalEmployees = await this.prisma.employeeMembership.count({
      where: { companyId, departmentId, status: EmployeeStatus.ACTIVE },
    });
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        completedAt: { gte: period.start, lte: period.end },
        user: { employeeMembership: { companyId, departmentId } },
      },
      include: { offer: { select: { category: true } } },
    });
    const activeEmployees = await this.prisma.booking
      .groupBy({
        by: ['userId'],
        where: {
          status: BookingStatus.COMPLETED,
          completedAt: { gte: period.start, lte: period.end },
          user: { employeeMembership: { companyId, departmentId } },
        },
      })
      .then((groups) => groups.length);

    const categoryCounts = new Map<string, number>();
    for (const booking of bookings) {
      categoryCounts.set(
        booking.offer.category,
        (categoryCounts.get(booking.offer.category) ?? 0) + 1,
      );
    }

    return {
      departmentId,
      departmentName: department.name,
      totalEmployees,
      activeRate: totalEmployees === 0 ? 0 : (activeEmployees / totalEmployees) * 100,
      topCategories: [...categoryCounts.entries()].map(([category, bookingCount]) => ({
        category,
        bookingCount,
      })),
    };
  }

  private topEntry(values: Map<string, number>): string | undefined {
    return [...values.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
  }
}
