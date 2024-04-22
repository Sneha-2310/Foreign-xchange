import { Module } from '@nestjs/common';
import { FxConversionController } from './fx-conversion.controller';
import {FxRatesService} from '../fxRates/fxRates.service';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import{AccountsModule} from '../accounts/accounts.module';


@Module({
  imports:[HttpModule,AccountsModule,
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 5,
    }]),
  ],
  controllers: [FxConversionController],
  providers: [FxRatesService,
    {
      provide:APP_GUARD,
      useClass:ThrottlerGuard,
    }
  ],
})
export class FxConversionModule {}
