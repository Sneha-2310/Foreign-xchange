import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FxRatesService {
  private fxRatesCache: Record<string, number> = {'USD_JPY':50};
//  private expiryDurationSeconds = 30;
  private readonly apiKey = process.env.API_KEY;
  private readonly apiUrl = 'https://www.alphavantage.co';

  @Cron(CronExpression.EVERY_30_SECONDS,)
  async fetchFxRates(one: string, two: string): Promise<void> {
    try {
      one='USD';
      two='JPY';
      
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
    const key = `${fromCurrency}_${toCurrency}`;
    return this.fxRatesCache[key] || 0; 
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
  return parseFloat(convertedAmount.toFixed(2)); 
   
  }
}
