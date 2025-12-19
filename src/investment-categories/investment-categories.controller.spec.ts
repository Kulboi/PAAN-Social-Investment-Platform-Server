import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentCategoriesController } from './investment-categories.controller';

describe('InvestmentCategoriesController', () => {
  let controller: InvestmentCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentCategoriesController],
    }).compile();

    controller = module.get<InvestmentCategoriesController>(InvestmentCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
