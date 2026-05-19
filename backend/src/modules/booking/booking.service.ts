import { Injectable } from '@nestjs/common';
import {
  ActivityRecord,
  Booking,
  BookingStatus,
  SlotStatus,
} from '@prisma/client';
import { randomBytes } from 'crypto';

import {
  SlotFullError,
  SlotUnavailableError,
  UnauthorizedError,
} from '../../shared/errors/app-error';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { assertValidTransition } from './booking-state';
import type { CreateBookingInput } from './booking.schemas';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUniqueOrThrow({
        where: { id: input.slotId },
      });
      if (slot.availableCapacity <= 0) {
        throw new SlotFullError();
      }
      if (slot.status !== SlotStatus.AVAILABLE) {
        throw new SlotUnavailableError();
      }

      const offer = await tx.offer.findUniqueOrThrow({
        where: { id: input.offerId },
      });

      const booking = await tx.booking.create({
        data: {
          userId: input.userId,
          partnerId: offer.partnerId,
          offerId: input.offerId,
          slotId: input.slotId,
          companyId: input.companyId,
          tokenUsed: offer.tokenPrice,
          tokenSource: input.tokenSource,
          status: BookingStatus.PENDING,
          checkInCode: this.generateCheckInCode(),
        },
      });

      await this.walletService.deductForBooking(
        input.userId,
        booking.id,
        offer.tokenPrice,
        input.tokenSource,
        tx,
      );

      await tx.slot.update({
        where: { id: input.slotId },
        data: { availableCapacity: { decrement: 1 } },
      });

      assertValidTransition(BookingStatus.PENDING, BookingStatus.CONFIRMED);
      return tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CONFIRMED },
      });
    });
  }

  async listUserBookings(userId: string, status?: BookingStatus): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId, status },
      include: {
        offer: true,
        partner: true,
        slot: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByCheckInCode(checkInCode: string): Promise<Booking> {
    return this.prisma.booking.findUniqueOrThrow({
      where: { checkInCode },
      include: { offer: true, partner: true, slot: true },
    });
  }

  async confirmCheckIn(checkInCode: string, partnerId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUniqueOrThrow({
      where: { checkInCode },
      include: { slot: true },
    });
    if (booking.partnerId !== partnerId) {
      throw new UnauthorizedError();
    }

    assertValidTransition(booking.status, BookingStatus.CHECKED_IN);
    return this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CHECKED_IN,
        checkedInAt: new Date(),
      },
    });
  }

  async markCompleted(bookingId: string, partnerId: string): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUniqueOrThrow({
        where: { id: bookingId },
        include: { offer: true },
      });
      if (booking.partnerId !== partnerId) {
        throw new UnauthorizedError();
      }

      assertValidTransition(booking.status, BookingStatus.COMPLETED);
      const completed = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      await tx.activityRecord.upsert({
        where: { bookingId },
        update: {
          completedAt: completed.completedAt ?? new Date(),
        },
        create: {
          userId: booking.userId,
          bookingId,
          category: booking.offer.category,
          partnerId: booking.partnerId,
          offerId: booking.offerId,
          completedAt: completed.completedAt ?? new Date(),
          durationMinutes: booking.offer.durationMinutes,
        },
      });

      return completed;
    });
  }

  async markNoShow(bookingId: string, partnerId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });
    if (booking.partnerId !== partnerId) {
      throw new UnauthorizedError();
    }

    assertValidTransition(booking.status, BookingStatus.NO_SHOW);
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.NO_SHOW,
        noShowAt: new Date(),
      },
    });
  }

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUniqueOrThrow({ where: { id: bookingId } });
      assertValidTransition(booking.status, BookingStatus.CANCELLED);
      await this.walletService.refundBooking(bookingId, tx);
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { availableCapacity: { increment: 1 } },
      });
      return tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelReason: reason,
        },
      });
    });
  }

  async refundCompletedBooking(bookingId: string): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUniqueOrThrow({ where: { id: bookingId } });
      assertValidTransition(booking.status, BookingStatus.REFUNDED);
      await this.walletService.refundBooking(bookingId, tx);
      return tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.REFUNDED,
          refundedAt: new Date(),
        },
      });
    });
  }

  async createActivityRecordFromBooking(bookingId: string): Promise<ActivityRecord> {
    const booking = await this.prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { offer: true },
    });

    return this.prisma.activityRecord.create({
      data: {
        userId: booking.userId,
        bookingId,
        category: booking.offer.category,
        partnerId: booking.partnerId,
        offerId: booking.offerId,
        completedAt: booking.completedAt ?? new Date(),
        durationMinutes: booking.offer.durationMinutes,
      },
    });
  }

  getCheckInQrPayload(checkInCode: string): { checkInCode: string; url: string } {
    return {
      checkInCode,
      url: `/qr/check-in/${checkInCode}`,
    };
  }

  private generateCheckInCode(): string {
    return randomBytes(8).toString('hex');
  }
}
