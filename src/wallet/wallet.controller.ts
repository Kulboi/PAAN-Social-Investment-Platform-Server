import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RawBodyGuard } from '../common/guards/raw-body.guard';

import { WalletService } from './wallet.service';

import { Wallet } from './entities/wallet.entity';

import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@Controller('api/v1/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('create')
  @ApiOperation({ summary: 'Create user wallet' })
  @ApiResponse({ 
    status: 200, description: 'Wallet creation successful.', 
    type: Wallet 
  })
  @ApiBearerAuth()
  createWallet(@Request() req) {
    return this.walletService.createWallet(req.user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get user wallet balance' })
  @ApiResponse({
    status: 200, description: 'Wallet balance retrieved successfully.',
    type: Wallet
  })
  @ApiBearerAuth()
  getBalance(@Request() req) {
    return this.walletService.getBalance(req.user.id);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit funds into user wallet' })
  @ApiResponse({
    status: 200, description: 'Funds deposited successfully.',
    type: Wallet
  })
  @ApiBody({ type: DepositDto })
  @ApiBearerAuth()
  deposit(@Request() req, @Body() dto: DepositDto) {
    return this.walletService.deposit(req.user.id, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get user wallet transactions' })
  @ApiResponse({
    status: 200, description: 'Wallet transactions retrieved successfully.',
    type: Wallet
  })
  @ApiBearerAuth()
  getTransactions(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.walletService.getTransactions(req.user.id, Number(page), Number(limit));
  }  

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw funds from user wallet' })
  @ApiResponse({
    status: 200, description: 'Funds withdrawn successfully.',
    type: Wallet
  })
  @ApiBody({ type: WithdrawDto })
  @ApiBearerAuth()
  withdraw(@Request() req, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(req.user.id, dto);
  }
}