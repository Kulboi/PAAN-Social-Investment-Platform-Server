import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentCategoriesService } from './investment-categories.service';

describe('InvestmentCategoriesService', () => {
  let service: InvestmentCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentCategoriesService],
    }).compile();

    service = module.get<InvestmentCategoriesService>(InvestmentCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
