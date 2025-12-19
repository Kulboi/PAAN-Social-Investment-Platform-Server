import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvestmentCategoriesController } from './investment-categories.controller';

import { InvestmentCategoriesService } from './investment-categories.service';

import { InvestmentCategory } from 'src/investment-categories/entities/investment-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentCategory])],
  controllers: [InvestmentCategoriesController],
  providers: [InvestmentCategoriesService]
})
export class InvestmentCategoriesModule {}
