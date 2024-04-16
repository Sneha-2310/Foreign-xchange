import { Module } from '@nestjs/common';
import { FxRatesController } from './fx-rates.controller';
import { FxRatesService } from './fxRates.service';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports:[ThrottlerModule.forRoot([{
    ttl: 3000,
    limit: 2,
  }])],
  controllers: [FxRatesController],
  providers: [FxRatesService,{
    provide:APP_GUARD,
    useClass:ThrottlerGuard,
  }],
})
export class FxRatesModule {}
