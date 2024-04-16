import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
  private balances: Record<string, number> = { };

  async topUpAccount(currency: string, amount: number): Promise<void> {
    if (this.balances[currency]) {
      this.balances[currency] += amount;
    } else {
      this.balances[currency] = amount;
    }
  }

  getAccountBalances(): Record<string, number> {
    return this.balances;
  }
}
