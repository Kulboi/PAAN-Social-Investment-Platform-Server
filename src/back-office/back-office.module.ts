import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { BackOfficeController } from './back-office.controller';
import { BackOfficeService } from './back-office.service';

import { BackOfficeUser } from './entities/back-office-user.entity';

@Module({
  controllers: [BackOfficeController],
  providers: [BackOfficeService, JwtService],
  imports: [TypeOrmModule.forFeature([BackOfficeUser])],
})
export class BackOfficeModule {}
