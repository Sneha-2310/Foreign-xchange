import { Controller, Get, UseGuards } from '@nestjs/common';
import { FxRatesService } from '../fxRates/fxRates.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('fx-rates')
export class FxRatesController {
  constructor(private readonly fxRatesService: FxRatesService) {}
 
  @Get()
  @UseGuards(AuthGuard("local"))
  async getFxRates(): Promise<{ quoteId: string; expiry_at: number }> {
    try {
      const rates = this.fxRatesService.getFxRate('USD','JPY');
      console.log(rates);
      const quoteId = Math.random().toString(36).substring(7);
      const expiryAt = Math.floor(Date.now() / 1000) + 300; 

      return { quoteId, expiry_at: expiryAt };
    } catch (error) {
      console.error('Failed to fetch FX rates:', error);
      throw new Error('Failed to fetch FX rates');
    }
  }
}
