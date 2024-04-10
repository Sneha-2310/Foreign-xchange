import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FxRatesService } from '../fxRates/fxRates.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/role.guard';
import { CONSTANTS } from 'src/user/const';

@Controller('fx-conversion')
export class FxConversionController {
  constructor(private readonly fxRatesService: FxRatesService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"),new RolesGuard(CONSTANTS.ROLES.USER))
  async convertFx(
    @Body() body: { quoteId: string; fromCurrency: string; toCurrency: string; amount: number },
  ): Promise<{ convertedAmount: number; currency: string }> {
    const { quoteId, fromCurrency, toCurrency, amount } = body;
    
    // FX conversion using rates from the service
    const convertedAmount = await this.fxRatesService.convertAmount(fromCurrency, toCurrency, amount);

    return { convertedAmount, currency: toCurrency };
  }
}
