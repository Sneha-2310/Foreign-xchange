import { Test, TestingModule } from '@nestjs/testing';
import { FxRatesController } from './fx-rates.controller';

describe('FxRatesController', () => {
  let controller: FxRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxRatesController],
    }).compile();

    controller = module.get<FxRatesController>(FxRatesController);
  });

  it('should return FX rates', () => {
    const result = controller.getFxRates();
    expect(result).toEqual(expect.objectContaining({ quoteId: expect.any(String), expiry_at: expect.any(String) }));
  });
});
