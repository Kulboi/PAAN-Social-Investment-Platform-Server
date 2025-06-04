import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from './entities/wallet.entity';
import {
  WalletTransactions,
  TransactionType,
} from './entities/transaction.entity';

import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(WalletTransactions)
    private transactionRepo: Repository<WalletTransactions>,
  ) {}

  async createWallet(userId: number) {
    const wallet = this.walletRepo.create({ user: { id: userId } });
    return this.walletRepo.save(wallet);
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
