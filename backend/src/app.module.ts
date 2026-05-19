import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { CorporateModule } from './modules/corporate/corporate.module';
import { PartnerModule } from './modules/partner/partner.module';
import { SettlementModule } from './modules/settlement/settlement.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './shared/prisma/prisma.module';
import { RedisModule } from './shared/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    WalletModule,
    PartnerModule,
    BookingModule,
    CorporateModule,
    AnalyticsModule,
    SettlementModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
