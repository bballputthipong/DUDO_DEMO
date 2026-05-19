import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import {
  BookingFilterSchema,
  CreateOfferSchema,
  CreatePartnerSchema,
  CreateSlotSchema,
  RecurringSlotSchema,
  UpdateOfferSchema,
  UpdatePartnerSchema,
} from './partner.schemas';
import { PartnerService } from './partner.service';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  createPartner(@Body() body: unknown): ReturnType<PartnerService['createPartner']> {
    return this.partnerService.createPartner(CreatePartnerSchema.parse(body));
  }

  @Get(':partnerId')
  getProfile(@Param('partnerId') partnerId: string): ReturnType<PartnerService['getProfile']> {
    return this.partnerService.getProfile(partnerId);
  }

  @Patch(':partnerId')
  updateProfile(
    @Param('partnerId') partnerId: string,
    @Body() body: unknown,
  ): ReturnType<PartnerService['updateProfile']> {
    return this.partnerService.updateProfile(partnerId, UpdatePartnerSchema.parse(body));
  }

  @Post(':partnerId/offers')
  createOffer(
    @Param('partnerId') partnerId: string,
    @Body() body: unknown,
  ): ReturnType<PartnerService['createOffer']> {
    return this.partnerService.createOffer(partnerId, CreateOfferSchema.parse(body));
  }

  @Get(':partnerId/offers')
  listOffers(@Param('partnerId') partnerId: string): ReturnType<PartnerService['listOffers']> {
    return this.partnerService.listOffers(partnerId);
  }

  @Patch('offers/:offerId')
  updateOffer(
    @Param('offerId') offerId: string,
    @Body() body: unknown,
  ): ReturnType<PartnerService['updateOffer']> {
    return this.partnerService.updateOffer(offerId, UpdateOfferSchema.parse(body));
  }

  @Post('offers/:offerId/slots')
  createSlot(
    @Param('offerId') offerId: string,
    @Body() body: unknown,
  ): ReturnType<PartnerService['createSlot']> {
    return this.partnerService.createSlot(offerId, CreateSlotSchema.parse(body));
  }

  @Post('offers/:offerId/slots/recurring')
  createRecurringSlots(
    @Param('offerId') offerId: string,
    @Body() body: unknown,
  ): ReturnType<PartnerService['createRecurringSlots']> {
    return this.partnerService.createRecurringSlots(offerId, RecurringSlotSchema.parse(body));
  }

  @Delete('slots/:slotId')
  cancelSlot(@Param('slotId') slotId: string): ReturnType<PartnerService['cancelSlot']> {
    return this.partnerService.cancelSlot(slotId);
  }

  @Get(':partnerId/bookings')
  getBookings(
    @Param('partnerId') partnerId: string,
    @Query() query: unknown,
  ): ReturnType<PartnerService['getBookings']> {
    return this.partnerService.getBookings(partnerId, BookingFilterSchema.parse(query));
  }

  @Get('check-in/:code')
  getBookingByCheckInCode(
    @Param('code') code: string,
  ): ReturnType<PartnerService['getBookingByCheckInCode']> {
    return this.partnerService.getBookingByCheckInCode(code);
  }
}
