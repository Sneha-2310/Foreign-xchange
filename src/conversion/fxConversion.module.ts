import { Module } from '@nestjs/common';
import { FxConversionController } from './fx-conversion.controller';
import {FxRatesService} from '../fxRates/fxRates.service';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports:[HttpModule,
    ThrottlerModule.forRoot([{
      ttl: 3000,
      limit: 2,
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
