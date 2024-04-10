import { Test, TestingModule } from '@nestjs/testing';
import { FxConversionController } from './fx-conversion.controller';

describe('FxConversionController', () => {
  let controller: FxConversionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxConversionController],
    }).compile();

    controller = module.get<FxConversionController>(FxConversionController);
  });

  it('should convert currency', () => {
    const result = controller.convertFx({
      quoteId: '12345',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 100,
    });
    expect(result).toEqual(expect.objectContaining({ convertedAmount: expect.any(Number), currency: 'EUR' }));
  });
});
