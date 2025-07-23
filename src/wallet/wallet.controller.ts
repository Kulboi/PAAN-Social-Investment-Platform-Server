import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RawBodyGuard } from '../common/guards/raw-body.guard';

import { WalletService } from './wallet.service';

import { Wallet } from './entities/wallet.entity';

import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('create')
  @ApiOperation({ summary: 'Create user wallet' })
  @ApiResponse({ 
    status: 200, description: 'Wallet creation successful.', 
    type: Wallet 
  })
  createWallet(@Request() req) {
    return this.walletService.createWallet(req.user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get user wallet balance' })
  @ApiResponse({
    status: 200, description: 'Wallet balance retrieved successfully.',
    type: Wallet
  })
  getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  getTransactions(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.walletService.getTransactions(req.user.id, Number(page), Number(limit));
  }

  @Post('deposit')
  deposit(@Request() req, @Body('amount') dto: DepositDto) {
    return this.walletService.initiateDeposit(req.user.id, dto.amount);
  }

  @Post('deposit-webhook')
  @UseGuards(RawBodyGuard) // if verifying signature
  async handleWebhook(@Body() body: any) {
    await this.walletService.handleDepositWebhook(body);
    return { status: 'ok' };
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(req.user.id, dto);
  }
}