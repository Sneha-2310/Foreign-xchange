import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/role.guard';
import { CONSTANTS } from 'src/user/const';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  
  @Post('topup')
  @UseGuards(AuthGuard("jwt"),new RolesGuard(CONSTANTS.ROLES.USER))
  async topUpAccount(@Body() body: { currency: string; amount: number }): Promise<void> {
    const { currency, amount } = body;
    await this.accountsService.topUpAccount(currency, amount);
  }

  @Get('balance')
  @UseGuards(AuthGuard("jwt"),new RolesGuard(CONSTANTS.ROLES.USER))
  async getAccountBalances(): Promise<{ balances: Record<string, number> }> {
    const balances = this.accountsService.getAccountBalances();
    return { balances };
  }
}
