import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { MailerService } from 'src/common/utils/mailer.service';

import { AuthController } from './auth.controller';

import { User } from 'src/user/entities/user.entity';
import { Verification } from 'src/auth/entities/verification.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, Wallet])],
  controllers: [AuthController],
  providers: [AuthService, MailerService, JwtService],
})
export class AuthModule {}
