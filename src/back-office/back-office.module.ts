import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { BackOfficeController } from './back-office.controller';
import { BackOfficeService } from './back-office.service';
import { InvestmentCategoriesService } from 'src/investment-categories/investment-categories.service';
import { InvestmentsService } from 'src/investments/investments.service';
import { CompaniesService } from 'src/companies/companies.service';
import { MailerService } from 'src/common/utils/mailer.service';

import { BackOfficeUser } from 'src/back-office/entities/back-office-user.entity';
import { InvestmentCategory } from 'src/investment-categories/entities/investment-category.entity';
import { Investment } from 'src/investments/entities/investment.entity';
import { InvestmentTransaction } from 'src/investments/entities/investment-transaction.entity';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { TokenBlacklist } from 'src/auth/entities/token-blacklist.entity';

@Module({
  controllers: [BackOfficeController],
  providers: [
    BackOfficeService,
    JwtService,
    InvestmentCategoriesService,
    InvestmentsService,
    CompaniesService,
    MailerService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      BackOfficeUser,
      InvestmentCategory,
      Company,
      Investment,
      InvestmentTransaction,
      User,
      TokenBlacklist,
    ]),
  ],
})
export class BackOfficeModule {}
