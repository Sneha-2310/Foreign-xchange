import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports :[ThrottlerModule.forRoot([{
    ttl: 3000,
    limit: 2,
  }]),],
  controllers: [AccountsController],
  providers: [AccountsService,{
    provide:APP_GUARD,
    useClass:ThrottlerGuard,
  }],
})
export class AccountsModule {}
