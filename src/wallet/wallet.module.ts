import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { WalletController } from './wallet.controller';

import { WalletService } from './wallet.service';
import { FlutterwaveService } from 'src/common/utils/flutterwave.service';
import { WebhookLoggerService } from 'src/common/utils/webhook-logger.service';
import { MailerService } from 'src/common/utils/mailer.service';

import { Wallet } from './entities/wallet.entity';
import { WalletTransactions } from './entities/transaction.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransactions, User]), HttpModule],
  controllers: [WalletController],
  providers: [WalletService, FlutterwaveService, WebhookLoggerService, MailerService]
})
export class WalletModule {}
