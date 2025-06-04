import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { WalletService } from './wallet.service';

import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('create')
  createWallet(@Request() req) {
    return this.walletService.createWallet(req.user.id);
  }

  @Get('balance')
  getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  getTransactions(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.walletService.getTransactions(req.user.id, Number(page), Number(limit));
  }

  @Post('deposit')
  deposit(@Request() req, @Body() dto: DepositDto) {
    return this.walletService.deposit(req.user.id, dto);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(req.user.id, dto);
  }
}