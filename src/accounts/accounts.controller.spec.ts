import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should top up the account', () => {
    const result = controller.topUpAccount({ currency: 'USD', amount: 100 });
    expect(result).toBe('Account topped up successfully!');
  });
});
