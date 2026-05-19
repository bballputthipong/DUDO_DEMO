import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import {
  AdminIdSchema,
  AdminLogFilterSchema,
  AdminUserFilterSchema,
  AdjustTokenSchema,
  ReasonSchema,
} from './admin.schemas';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(@Query() query: unknown): ReturnType<AdminService['listUsers']> {
    return this.adminService.listUsers(AdminUserFilterSchema.parse(query));
  }

  @Patch('users/:userId/suspend')
  suspendUser(
    @Param('userId') userId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['suspendUser']> {
    const input = ReasonSchema.parse(body);
    return this.adminService.suspendUser(userId, input.reason, input.adminId);
  }

  @Patch('users/:userId/unsuspend')
  unsuspendUser(
    @Param('userId') userId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['unsuspendUser']> {
    const input = ReasonSchema.parse(body);
    return this.adminService.unsuspendUser(userId, input.reason, input.adminId);
  }

  @Patch('partners/:partnerId/approve')
  approvePartner(
    @Param('partnerId') partnerId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['approvePartner']> {
    const input = AdminIdSchema.parse(body);
    return this.adminService.approvePartner(partnerId, input.adminId);
  }

  @Patch('partners/:partnerId/reject')
  rejectPartner(
    @Param('partnerId') partnerId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['rejectPartner']> {
    const input = ReasonSchema.parse(body);
    return this.adminService.rejectPartner(partnerId, input.reason, input.adminId);
  }

  @Patch('partners/:partnerId/suspend')
  suspendPartner(
    @Param('partnerId') partnerId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['suspendPartner']> {
    const input = ReasonSchema.parse(body);
    return this.adminService.suspendPartner(partnerId, input.reason, input.adminId);
  }

  @Post('bookings/:bookingId/cancel')
  cancelBooking(
    @Param('bookingId') bookingId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['cancelBooking']> {
    const input = ReasonSchema.parse(body);
    return this.adminService.cancelBooking(bookingId, input.reason, input.adminId);
  }

  @Post('bookings/:bookingId/refund')
  refundBooking(
    @Param('bookingId') bookingId: string,
    @Body() body: unknown,
  ): ReturnType<AdminService['refundBooking']> {
    const input = AdminIdSchema.parse(body);
    return this.adminService.refundBooking(bookingId, input.adminId);
  }

  @Post('tokens/adjust')
  adjustTokenBalance(@Body() body: unknown): ReturnType<AdminService['adjustTokenBalance']> {
    const input = AdjustTokenSchema.parse(body);
    return this.adminService.adjustTokenBalance(
      input.userId,
      input.amount,
      input.source,
      input.reason,
      input.adminId,
    );
  }

  @Get('logs')
  getAdminLog(@Query() query: unknown): ReturnType<AdminService['getAdminLog']> {
    return this.adminService.getAdminLog(AdminLogFilterSchema.parse(query));
  }
}
