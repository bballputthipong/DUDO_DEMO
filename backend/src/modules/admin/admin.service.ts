import { Injectable } from '@nestjs/common';
import {
  AdminAction,
  AdminActionType,
  Booking,
  Partner,
  PartnerStatus,
  TokenSource,
  User,
  WalletTransaction,
} from '@prisma/client';

import { BookingService } from '../booking/booking.service';
import { WalletService } from '../wallet/wallet.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type { AdminLogFilterInput, AdminUserFilterInput } from './admin.schemas';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingService: BookingService,
    private readonly walletService: WalletService,
  ) {}

  async listUsers(filters: AdminUserFilterInput): Promise<PaginatedResult<User>> {
    const where =
      filters.query === undefined
        ? {}
        : {
            OR: [
              { email: { contains: filters.query, mode: 'insensitive' as const } },
              { name: { contains: filters.query, mode: 'insensitive' as const } },
              { phone: { contains: filters.query, mode: 'insensitive' as const } },
            ],
          };
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (filters.page - 1) * filters.perPage,
        take: filters.perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return this.paginate(users, total, filters.page, filters.perPage);
  }

  async suspendUser(userId: string, reason: string, adminId: string): Promise<void> {
    await this.withAdminLog(
      adminId,
      AdminActionType.USER_SUSPEND,
      'user',
      userId,
      reason,
      async () => {
        await this.prisma.user.update({
          where: { id: userId },
          data: { isActive: false },
        });
      },
    );
  }

  async unsuspendUser(userId: string, reason: string, adminId: string): Promise<void> {
    await this.withAdminLog(
      adminId,
      AdminActionType.USER_UNSUSPEND,
      'user',
      userId,
      reason,
      async () => {
        await this.prisma.user.update({
          where: { id: userId },
          data: { isActive: true },
        });
      },
    );
  }

  async approvePartner(partnerId: string, adminId: string): Promise<Partner> {
    return this.withAdminLog(
      adminId,
      AdminActionType.PARTNER_APPROVE,
      'partner',
      partnerId,
      'Partner approved',
      async () =>
        this.prisma.partner.update({
          where: { id: partnerId },
          data: { status: PartnerStatus.ACTIVE, approvedAt: new Date() },
        }),
    );
  }

  async rejectPartner(partnerId: string, reason: string, adminId: string): Promise<Partner> {
    return this.withAdminLog(
      adminId,
      AdminActionType.PARTNER_REJECT,
      'partner',
      partnerId,
      reason,
      async () =>
        this.prisma.partner.update({
          where: { id: partnerId },
          data: { status: PartnerStatus.REJECTED },
        }),
    );
  }

  async suspendPartner(partnerId: string, reason: string, adminId: string): Promise<Partner> {
    return this.withAdminLog(
      adminId,
      AdminActionType.PARTNER_SUSPEND,
      'partner',
      partnerId,
      reason,
      async () =>
        this.prisma.partner.update({
          where: { id: partnerId },
          data: { status: PartnerStatus.SUSPENDED },
        }),
    );
  }

  async cancelBooking(bookingId: string, reason: string, adminId: string): Promise<Booking> {
    return this.withAdminLog(
      adminId,
      AdminActionType.BOOKING_CANCEL,
      'booking',
      bookingId,
      reason,
      async () => this.bookingService.cancelBooking(bookingId, reason),
    );
  }

  async refundBooking(bookingId: string, adminId: string): Promise<Booking> {
    return this.withAdminLog(
      adminId,
      AdminActionType.BOOKING_REFUND,
      'booking',
      bookingId,
      'Booking refunded',
      async () => this.bookingService.refundCompletedBooking(bookingId),
    );
  }

  async adjustTokenBalance(
    userId: string,
    amount: number,
    source: TokenSource,
    reason: string,
    adminId: string,
  ): Promise<WalletTransaction> {
    return this.withAdminLog(
      adminId,
      AdminActionType.TOKEN_ADJUST,
      'user',
      userId,
      reason,
      async () => this.walletService.adminAdjust(userId, amount, source, reason, adminId),
    );
  }

  async getAdminLog(filters: AdminLogFilterInput): Promise<PaginatedResult<AdminAction>> {
    const where = {
      type: filters.type,
      targetEntity: filters.targetEntity,
      targetId: filters.targetId,
    };
    const [logs, total] = await this.prisma.$transaction([
      this.prisma.adminAction.findMany({
        where,
        skip: (filters.page - 1) * filters.perPage,
        take: filters.perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.adminAction.count({ where }),
    ]);

    return this.paginate(logs, total, filters.page, filters.perPage);
  }

  private async withAdminLog<T>(
    adminId: string,
    type: AdminActionType,
    targetEntity: string,
    targetId: string,
    description: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const result = await operation();
    await this.prisma.adminAction.create({
      data: {
        adminUserId: adminId,
        type,
        targetEntity,
        targetId,
        description,
      },
    });
    return result;
  }

  private paginate<T>(data: T[], total: number, page: number, perPage: number): PaginatedResult<T> {
    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
