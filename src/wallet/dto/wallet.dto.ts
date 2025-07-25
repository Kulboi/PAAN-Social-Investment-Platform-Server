import { IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionRef: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class WithdrawDto {
  @IsNumber()
  @Min(100)
  amount: number;
}