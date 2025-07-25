import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlutterwaveService {
  constructor(private http: HttpService, private configService: ConfigService) {}

  async initiateDeposit(email: string, amount: number) {
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
  }

  async verifyTransaction(txId: string) {
    const response = await this.http.get(`https://api.flutterwave.com/v3/transactions/${txId}/verify`, {
      headers: {
        Authorization: `Bearer ${this.configService.get('FLUTTERWAVE_SECRET_KEY')}`,
      },
    }).toPromise();
    
    return response.data;
  }

  async withdraw(email: string, amount: number) {
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
  }
}