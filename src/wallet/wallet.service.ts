import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FlutterwaveService } from 'src/common/utils/flutterwave.service';
import { WebhookLoggerService } from 'src/common/utils/webhook-logger.service';
import { MailerService } from 'src/common/utils/mailer.service';

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
    private mailerService: MailerService,
  ) {}

  async createWallet(userId: string) {
    const wallet = this.walletRepo.create({ user: { id: userId } });
    const savedWallet = await this.walletRepo.save(wallet);

    return { 
      data: {
        balance: wallet.balance
      }
    }
  }

  async getBalance(userId: string) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    return { 
      data: {
        balance: wallet.balance
      }
    }
  }

  async getTransactions(userId: string, page = 1, limit = 10) {
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

  async deposit(userId: string, dto: DepositDto) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });
  
    if (!wallet) {
      await this.mailerService.sendDepositFailureNotification({
        to: wallet.user.email,
        reference: dto.transactionRef,
      });
      throw new NotFoundException('Wallet not found');
    }

    // TODO: Uncomment this when the flutterwave service is ready
    // const verifyDeposit = await this.flutterwaveService.verifyTransaction(dto.transactionId);
    // console.log({verifyDeposit});
    // if (verifyDeposit.status !== 'successful') throw new BadRequestException('Deposit failed');

    wallet.balance += Number(dto.amount);
    await this.walletRepo.save(wallet);

    const transaction = this.transactionRepo.create({
      amount: dto.amount,
      type: TransactionType.DEPOSIT,
      transactionId: dto.transactionId,
      reference: dto.transactionRef,
      status: TransactionStatus.SUCCESS,
      wallet,
    });
    await this.transactionRepo.save(transaction);

    // Send email notification to user
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    await this.mailerService.sendDepositSuccessNotification({
      to: user.email,
      reference: dto.transactionRef,
      balance: wallet.balance,
    });

    return { 
      message: 'Deposit successful',
      data: {
        balance: wallet.balance
      }
    }
  }

  async withdraw(userId: string, dto: WithdrawDto) {
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
