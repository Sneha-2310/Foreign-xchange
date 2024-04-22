import { Controller, Post,Body, UseGuards } from '@nestjs/common';
import { FxRatesService } from '../fxRates/fxRates.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('fx-rates')
export class FxRatesController {
  constructor(private readonly fxRatesService: FxRatesService) {}
 
  @Post()
  @UseGuards(AuthGuard("jwt"))
  async getFxRates(@Body() body: { fromCurrency: string; toCurrency: string},): Promise<{ quoteId: string; expiry_at: number }> {
    try {
      const {fromCurrency, toCurrency } = body;
      //console.log(fromCurrency,toCurrency);

      const rates = this.fxRatesService.getFxRate(fromCurrency,toCurrency);
      
      const quoteId = Math.random().toString(36).substring(7);
      const expiryAt = Math.floor(Date.now() / 1000) + 300; 

      this.fxRatesService.storeQuoteId(quoteId, 30);

      return { quoteId, expiry_at: expiryAt };
    } catch (error) {
      console.error('Failed to fetch FX rates:', error);
      throw new Error('Failed to fetch FX rates');
    }
  }

}
