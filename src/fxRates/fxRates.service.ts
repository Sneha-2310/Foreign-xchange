import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class FxRatesService {
  private fxRatesCache: Record<string, number> = {};
  private expiryDurationSeconds = 30;
  private readonly apiKey = 'TZNFTYRMJCHJTHMB';
  private readonly apiUrl = 'https://www.alphavantage.co';


  @Cron(CronExpression.EVERY_30_SECONDS,  )
  async fetchFxRates(one: string, two: string): Promise<void> {
    try {
      const url = `${this.apiUrl}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${one}&to_currency=${two}&apikey=${this.apiKey}`;
      const response = await axios.get(url);
      const { data } = response;
      //console.log(data);

      if (data['Realtime Currency Exchange Rate']) {
        const exchangeRate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        this.fxRatesCache[`${one}_${two}`] = exchangeRate;
      }

      
      setTimeout(() => {
        delete this.fxRatesCache[`${one}_${two}`]; // Clearing cache after expiry duration
      }, this.expiryDurationSeconds * 1000);
    } catch (error) {
      console.error('Failed to fetch FX rates:', error);
      throw new Error('Failed to fetch FX rates');
    }
  }

  getFxRate(fromCurrency: string, toCurrency: string): number {
    const key = `${fromCurrency}_${toCurrency}`;
    return this.fxRatesCache[key] || 0; // Return rate or default to 0
  }

  async convertAmount(fromCurrency: string, toCurrency: string, amount: number): Promise<number> {
    const exchangeRate = await this.getFxRate(fromCurrency, toCurrency);

    if (!exchangeRate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }

   const convertedAmount = amount * exchangeRate;
   return parseFloat(convertedAmount.toFixed(2)); 
    return 5;
  }
}
