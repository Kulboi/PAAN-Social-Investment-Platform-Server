import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletController } from './wallet.controller';

import { WalletService } from './wallet.service';

import { Wallet } from './entities/wallet.entity';
import { WalletTransactions } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransactions])],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
