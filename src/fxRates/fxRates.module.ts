import { Module } from '@nestjs/common';
import { FxRatesController } from './fx-rates.controller';
import { FxRatesService } from './fxRates.service';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports:[ThrottlerModule.forRoot([{
    ttl: 1000,
    limit: 5,
  }]),AccountsModule],
  controllers: [FxRatesController],
  providers: [FxRatesService,{
    provide:APP_GUARD,
    useClass:ThrottlerGuard,
  }],
})
export class FxRatesModule {}
