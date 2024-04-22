import { Injectable } from '@nestjs/common';
import { error } from 'console';

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
  func(from:string,to:string,amount:number,initialAmount:number):void{
    if(this.balances[from]){
      if(this.balances[from]<initialAmount){
        throw new Error('You do not have enough money');}
        else{
      this.balances[from]-=initialAmount;
      if (this.balances[to]) {
        this.balances[to] += amount;
      } else {
        this.balances[to] = amount;
      }
    }
  }
    else { throw new Error('You do not have enough money');}
  }
}
