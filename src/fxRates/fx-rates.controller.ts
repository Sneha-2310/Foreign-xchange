import { Controller, Get, UseGuards, Query,Param } from '@nestjs/common';
import { FxRatesService } from '../fxRates/fxRates.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('fx-rates')
export class FxRatesController {
  constructor(private readonly fxRatesService: FxRatesService) {}
 
  @Get('/:from/:to')
  @UseGuards(AuthGuard("jwt"))
  async getFxRates(@Param('from') from: string, @Param('to') to: string): Promise<{ quoteId: string; expiry_at: number }> {
    try {
      
      // const rates =
     await this.fxRatesService.fetchFxRates(from.substring(1),to.substring(1));
      
      const quoteId = Math.random().toString(36).substring(7);
      const expiryAt = Math.floor(Date.now() / 1000) + 300; 

      this.fxRatesService.storeQuoteId(quoteId, 30);
      this.fxRatesService.validateQuoteId(quoteId);

      return { quoteId, expiry_at: expiryAt };
    } catch (error) {
      console.error('Failed to fetch FX rates:', error);
      throw new Error('Failed to fetch FX rates');
    }
  }

}
