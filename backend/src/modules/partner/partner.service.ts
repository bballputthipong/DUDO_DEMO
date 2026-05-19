import { Injectable } from '@nestjs/common';
import {
  BookingStatus,
  Offer,
  Partner,
  Slot,
  SlotStatus,
} from '@prisma/client';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import type {
  BookingFilterInput,
  CreateOfferInput,
  CreatePartnerInput,
  CreateSlotInput,
  RecurringSlotInput,
  UpdateOfferInput,
  UpdatePartnerInput,
} from './partner.schemas';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  async createPartner(data: CreatePartnerInput): Promise<Partner> {
    return this.prisma.partner.create({ data });
  }

  async getProfile(partnerId: string): Promise<Partner> {
    return this.prisma.partner.findUniqueOrThrow({ where: { id: partnerId } });
  }

  async updateProfile(partnerId: string, data: UpdatePartnerInput): Promise<Partner> {
    return this.prisma.partner.update({ where: { id: partnerId }, data });
  }

  async createOffer(partnerId: string, data: CreateOfferInput): Promise<Offer> {
    return this.prisma.offer.create({
      data: {
        ...data,
        partnerId,
      },
    });
  }

  async updateOffer(offerId: string, data: UpdateOfferInput): Promise<Offer> {
    return this.prisma.offer.update({ where: { id: offerId }, data });
  }

  async listOffers(partnerId: string): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSlot(offerId: string, data: CreateSlotInput): Promise<Slot> {
    return this.prisma.slot.create({
      data: {
        offerId,
        instructorName: data.instructorName,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        availableCapacity: data.availableCapacity ?? data.capacity,
        notes: data.notes,
      },
    });
  }

  async createRecurringSlots(offerId: string, data: RecurringSlotInput): Promise<Slot[]> {
    const slots = this.expandRecurringSlots(data);
    return this.prisma.$transaction(
      slots.map((slot) =>
        this.prisma.slot.create({
          data: {
            offerId,
            ...slot,
          },
        }),
      ),
    );
  }

  async cancelSlot(slotId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const bookings = await tx.booking.findMany({
        where: {
          slotId,
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
          },
        },
      });

      for (const booking of bookings) {
        await this.walletService.refundBooking(booking.id, tx);
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelReason: 'Slot cancelled by partner',
          },
        });
      }

      await tx.slot.update({
        where: { id: slotId },
        data: {
          status: SlotStatus.CANCELLED,
          availableCapacity: 0,
        },
      });
    });
  }

  async getBookings(partnerId: string, filters: BookingFilterInput) {
    return this.prisma.booking.findMany({
      where: {
        partnerId,
        status: filters.status as BookingStatus | undefined,
        slot:
          filters.from !== undefined || filters.to !== undefined
            ? {
                startTime: {
                  gte: filters.from,
                  lte: filters.to,
                },
              }
            : undefined,
      },
      include: {
        offer: true,
        slot: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingByCheckInCode(code: string) {
    return this.prisma.booking.findUniqueOrThrow({
      where: { checkInCode: code },
      include: { offer: true, slot: true, user: true },
    });
  }

  private expandRecurringSlots(data: RecurringSlotInput): Array<Omit<CreateSlotInput, 'startTime' | 'endTime'> & {
    startTime: Date;
    endTime: Date;
    availableCapacity: number;
  }> {
    const slots: Array<Omit<CreateSlotInput, 'startTime' | 'endTime'> & {
      startTime: Date;
      endTime: Date;
      availableCapacity: number;
    }> = [];
    const cursor = new Date(data.startDate);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(data.endDate);
    end.setHours(23, 59, 59, 999);

    while (cursor <= end) {
      if (data.daysOfWeek.includes(cursor.getDay())) {
        const startTime = this.combineDateAndTime(cursor, data.startTime);
        const endTime = this.combineDateAndTime(cursor, data.endTime);
        slots.push({
          instructorName: data.instructorName,
          startTime,
          endTime,
          capacity: data.capacity,
          availableCapacity: data.capacity,
          notes: data.notes,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return slots;
  }

  private combineDateAndTime(date: Date, time: string): Date {
    const [hourPart, minutePart] = time.split(':');
    const result = new Date(date);
    result.setHours(Number(hourPart), Number(minutePart), 0, 0);
    return result;
  }
}
