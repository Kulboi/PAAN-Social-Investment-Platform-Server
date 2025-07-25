import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlutterwaveService {
  constructor(private http: HttpService, private configService: ConfigService) {}

  async initiateDeposit(email: string, amount: number) {
    try {
      const response = await this.http.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: `tx-${Date.now()}`,
          amount,
          currency: 'NGN',
          redirect_url: 'https://yourapp.com/payment/callback',
          customer: { email },
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('FLUTTERWAVE_SECRET_KEY')}`,
          },
        }
      ).toPromise();
      
      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Transaction verification failed');
    }
  }

  async verifyTransaction(txId: string) {
    try {
      const response = await this.http.get(`https://api.flutterwave.com/v3/transactions/${txId}/verify`, {
        headers: {
          Authorization: `Bearer ${this.configService.get('FLUTTERWAVE_SECRET_KEY')}`,
        },
      }).toPromise();
      
      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Transaction verification failed');
    }
  }

  async withdraw({
    amount,
    account_bank,
    account_number,
    account_name,
    email
  }: {
    email: string;
    amount: number;
    account_bank: string;
    account_number: string;
    account_name: string;
  }) {
    try {
      const response = await this.http.post(
        'https://api.flutterwave.com/v3/payments',
        {
          account_bank,
          account_number,
          account_name,
          tx_ref: `tx-${Date.now()}`,
          amount, 
          currency: 'NGN',
          redirect_url: 'https://yourapp.com/payment/callback',
          customer: { email },
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('FLUTTERWAVE_SECRET_KEY')}`,
          },
        }
      ).toPromise();
      
      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Transaction verification failed');
    }
  }
}