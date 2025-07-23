import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';

import { UserService } from 'src/user/user.service';
import { FlutterwaveService } from 'src/common/utils/flutterwave.service';
import { WebhookLoggerService } from 'src/common/utils/webhook-logger.service';

import { Wallet } from './entities/wallet.entity';
import {
  WalletTransactions,
  TransactionType,
  TransactionStatus,
} from './entities/transaction.entity';
import { User } from '../user/entities/user.entity';

import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,

    @InjectRepository(WalletTransactions)
    private transactionRepo: Repository<WalletTransactions>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private flutterwaveService: FlutterwaveService,
    private webhookLoggerService: WebhookLoggerService,
  ) {}

  async createWallet(userId: number) {
    const wallet = this.walletRepo.create({ user: { id: userId } });
    const savedWallet = await this.walletRepo.save(wallet);

    return {
      balance: savedWallet.balance,
    }
  }

  async getBalance(userId: number) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return { balance: wallet.balance };
  }

  async getTransactions(userId: number, page = 1, limit = 10) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const [transactions, count] = await this.transactionRepo.findAndCount({
      where: { wallet: { id: wallet.id } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: transactions,
      total: count,
      page,
      limit,
    };
  }

  async initiateDeposit(userId: number, amount: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const flutterwaveRes = await this.flutterwaveService.initiateDeposit(
      user.email,
      amount,
    );
    return flutterwaveRes;
  }

  async handleDepositWebhook(payload: any) {
    const reference = payload.data.reference;
    const status = payload.data.status;

    await this.webhookLoggerService.log('flutterwave', payload);

    const transaction = await this.transactionRepo.findOne({
      where: { reference },
      relations: ['wallet'],
    });
    if (!transaction) return;

    transaction.status = status;
    await this.transactionRepo.save(transaction);

    if (status !== 'successful') {
      transaction.wallet.balance += transaction.amount;
      await this.walletRepo.save(transaction.wallet);
      // await this.mailerService.sendFailureNotification(transaction.wallet.user.email, reference);
    } else {
      // await this.mailerService.sendSuccessNotification(transaction.wallet.user.email, reference);
    }
  }

  async deposit(userId: number, dto: DepositDto) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    wallet.balance += Number(dto.amount);
    await this.walletRepo.save(wallet);

    const transaction = this.transactionRepo.create({
      amount: dto.amount,
      type: TransactionType.DEPOSIT,
      wallet,
    });
    await this.transactionRepo.save(transaction);

    return { message: 'Deposit successful' };
  }

  async withdraw(userId: number, dto: WithdrawDto) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < dto.amount)
      throw new BadRequestException('Insufficient balance');

    wallet.balance -= Number(dto.amount);
    await this.walletRepo.save(wallet);

    const transaction = this.transactionRepo.create({
      amount: dto.amount,
      type: TransactionType.WITHDRAWAL,
      wallet,
    });
    await this.transactionRepo.save(transaction);

    return { message: 'Withdrawal successful' };
  }
}
