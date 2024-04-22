import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class FxRatesService {
  constructor(private readonly accountService: AccountsService) {}
  private fxRatesCache: Record<string, number> = {'USD_JPY':50,'USD_EUR':100};
//  private expiryDurationSeconds = 30;
  private readonly apiKey = process.env.API_KEY;
  private readonly apiUrl = 'https://www.alphavantage.co';

  @Cron(CronExpression.EVERY_30_SECONDS,)
  async fetchFxRates(one: string, two: string): Promise<void> {
    try {

      one=one||'USD';
      two=two||'EUR';
      
      const url = `${this.apiUrl}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${one}&to_currency=${two}&apikey=${this.apiKey}`;
      const response = await axios.get(url);
      const { data } = response;
      console.log(data);

      if (data['Realtime Currency Exchange Rate']) {
        const exchangeRate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        this.fxRatesCache[`${one}_${two}`] = exchangeRate;
      }
    } catch (error) {
      console.error('Failed to fetch FX rates:', error);
      throw new Error('Failed to fetch FX rates');
    }
  }

   getFxRate(fromCurrency: string, toCurrency: string): number {
   
    this.fetchFxRates(fromCurrency,toCurrency);
    const key = `${fromCurrency}_${toCurrency}`;
    console.log(this.fxRatesCache[key]);
    
    if(this.fxRatesCache[key]!==undefined){
    return this.fxRatesCache[key]} 
    else {throw new Error('Enter a valid currency');} 
  }

  private quotes: Record<string, { expiryTimestamp: number }> = {};

  storeQuoteId(quoteId: string, expirySeconds: number): void {
    const expiryTimestamp = Math.floor(Date.now() / 1000) + expirySeconds*1000;
    this.quotes[quoteId] = { expiryTimestamp };
    console.log(this.quotes);
  }

  validateQuoteId(quoteId: string): boolean {
    const quote = this.quotes[quoteId];
    console.log(this.quotes);
    if (!quote) {
      // QuoteId not found
      console.log("first");
      return false;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (currentTimestamp > quote.expiryTimestamp) {
      delete this.quotes[quoteId];
      return false;
    }

    // QuoteId is valid and not expired
    return true;
  }

  async convertAmount(fromCurrency: string, toCurrency: string, amount: number): Promise<number> {
    const exchangeRate = this.fxRatesCache[`${fromCurrency}_${toCurrency}`]
    // await this.getFxRate(fromCurrency, toCurrency);

    if (!exchangeRate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }

  const convertedAmount = amount * exchangeRate;
   this.accountService.func(fromCurrency,toCurrency,convertedAmount,amount);
  return parseFloat(convertedAmount.toFixed(2)); 
   
  }
}
