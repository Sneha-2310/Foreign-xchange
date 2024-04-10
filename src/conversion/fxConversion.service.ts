import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { FxRatesService } from '../fxRates/fxRates.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class FxConversionService {
  constructor(
    private readonly fxRatesService: FxRatesService,
    private readonly httpService: HttpService,
  ) {}

  async convertAmount(quoteId: string, fromCurrency: string, toCurrency: string, amount: number): Promise<{ convertedAmount: number; currency: string }> {
    try {
      const exchangeRate = await this.fetchExchangeRate(fromCurrency, toCurrency).toPromise();

      if (!exchangeRate) {
        throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
      }

      const convertedAmount = amount * exchangeRate;

      return { convertedAmount, currency: toCurrency };
    } catch (error) {
      console.error('Failed to perform FX conversion:', error);
      throw new Error('Failed to perform FX conversion');
    }
  }

  private fetchExchangeRate(fromCurrency: string, toCurrency: string): Observable<number> {
    try {
      
      const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=TZNFTYRMJCHJTHMB`;

      return this.httpService.get(apiUrl).pipe(
        map((response: AxiosResponse<any>) => {
          const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];

          if (!exchangeRate) {
            throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
          }

          return parseFloat(exchangeRate);
        })
      );
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      throw new Error('Failed to fetch exchange rate');
    }
  }
}
