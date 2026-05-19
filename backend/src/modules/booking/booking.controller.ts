import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import {
  AdminRefundSchema,
  BookingHistoryQuerySchema,
  CancelBookingSchema,
  CreateBookingSchema,
  PartnerActionSchema,
} from './booking.schemas';
import { BookingService } from './booking.service';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('bookings')
  createBooking(@Body() body: unknown): ReturnType<BookingService['createBooking']> {
    return this.bookingService.createBooking(CreateBookingSchema.parse(body));
  }

  @Get('users/:userId/bookings')
  listUserBookings(
    @Param('userId') userId: string,
    @Query() query: unknown,
  ): ReturnType<BookingService['listUserBookings']> {
    const filters = BookingHistoryQuerySchema.parse(query);
    return this.bookingService.listUserBookings(userId, filters.status);
  }

  @Get('qr/check-in/:code')
  getBookingByCheckInCode(
    @Param('code') code: string,
  ): ReturnType<BookingService['getByCheckInCode']> {
    return this.bookingService.getByCheckInCode(code);
  }

  @Get('bookings/:bookingId/qr')
  getCheckInQrPayload(@Param('bookingId') bookingId: string): { bookingId: string; url: string } {
    return {
      bookingId,
      url: `/bookings/${bookingId}/qr`,
    };
  }

  @Post('api/v1/check-in/:code')
  confirmCheckIn(
    @Param('code') code: string,
    @Body() body: unknown,
  ): ReturnType<BookingService['confirmCheckIn']> {
    const input = PartnerActionSchema.parse(body);
    return this.bookingService.confirmCheckIn(code, input.partnerId);
  }

  @Post('bookings/:bookingId/complete')
  markCompleted(
    @Param('bookingId') bookingId: string,
    @Body() body: unknown,
  ): ReturnType<BookingService['markCompleted']> {
    const input = PartnerActionSchema.parse(body);
    return this.bookingService.markCompleted(bookingId, input.partnerId);
  }

  @Post('bookings/:bookingId/no-show')
  markNoShow(
    @Param('bookingId') bookingId: string,
    @Body() body: unknown,
  ): ReturnType<BookingService['markNoShow']> {
    const input = PartnerActionSchema.parse(body);
    return this.bookingService.markNoShow(bookingId, input.partnerId);
  }

  @Post('bookings/:bookingId/cancel')
  cancelBooking(
    @Param('bookingId') bookingId: string,
    @Body() body: unknown,
  ): ReturnType<BookingService['cancelBooking']> {
    const input = CancelBookingSchema.parse(body);
    return this.bookingService.cancelBooking(bookingId, input.reason);
  }

  @Post('bookings/:bookingId/refund')
  refundCompletedBooking(
    @Param('bookingId') bookingId: string,
    @Body() body: unknown,
  ): ReturnType<BookingService['refundCompletedBooking']> {
    AdminRefundSchema.parse(body);
    return this.bookingService.refundCompletedBooking(bookingId);
  }
}
