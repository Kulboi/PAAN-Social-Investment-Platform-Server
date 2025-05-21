import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { MailerService } from 'src/common/utils/mailer.service';

import { AuthController } from './auth.controller';

import { User } from './../user/entities/user.entity';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
