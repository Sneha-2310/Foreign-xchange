import { Module } from '@nestjs/common';
import { FxConversionController } from './fx-conversion.controller';
import {FxRatesService} from '../fxRates/fxRates.service';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import{AccountsModule} from '../accounts/accounts.module';
import { FxRatesModule } from 'src/fxRates/fxRates.module';


@Module({
  imports:[HttpModule,AccountsModule,FxRatesModule,
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 5,
    }]),
  ],
  controllers: [FxConversionController],
  providers: [
    {
      provide:APP_GUARD,
      useClass:ThrottlerGuard,
    }
  ],
})
export class FxConversionModule {}
