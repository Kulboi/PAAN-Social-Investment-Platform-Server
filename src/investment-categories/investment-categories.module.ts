import { Module } from '@nestjs/common';
import { InvestmentCategoriesController } from './investment-categories.controller';
import { InvestmentCategoriesService } from './investment-categories.service';

@Module({
  controllers: [InvestmentCategoriesController],
  providers: [InvestmentCategoriesService]
})
export class InvestmentCategoriesModule {}
