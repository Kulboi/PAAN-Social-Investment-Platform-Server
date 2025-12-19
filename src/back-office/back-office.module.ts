import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { BackOfficeController } from './back-office.controller';
import { BackOfficeService } from './back-office.service';
import { InvestmentCategoriesService } from 'src/investment-categories/investment-categories.service';
import { CompaniesService } from 'src/companies/companies.service';

import { BackOfficeUser } from 'src/back-office/entities/back-office-user.entity';
import { InvestmentCategory } from 'src/investment-categories/entities/investment-category.entity';
import { Company } from 'src/companies/entities/company.entity';

@Module({
  controllers: [BackOfficeController],
  providers: [BackOfficeService, JwtService, InvestmentCategoriesService, CompaniesService],
  imports: [TypeOrmModule.forFeature([BackOfficeUser, InvestmentCategory, Company])],
})
export class BackOfficeModule {}
