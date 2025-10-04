import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteModule } from './quote/quote.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { BearerAuthGuard } from './guards/auth.guard';
import { ThrottleGuard } from './guards/throttler.guard';
import { AppDataSource } from './data-source';
import { GlobalExceptionsFilter } from './filters/exception.filter';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    QuoteModule,
    LecturerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BearerAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottleGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {}
