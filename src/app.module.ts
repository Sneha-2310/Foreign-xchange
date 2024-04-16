import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FxRatesModule } from './fxRates/fxRates.module';
import { FxConversionModule } from './conversion/fxConversion.module';
import {AccountsModule} from './accounts/accounts.module';
import { ScheduleModule } from '@nestjs/schedule';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 5,
    }]),
    ScheduleModule.forRoot(),
    HttpModule, 
    FxRatesModule,
    FxConversionModule,
    AccountsModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [{
    provide:APP_GUARD,
    useClass:ThrottlerGuard,
  }], 
})
export class AppModule {}
