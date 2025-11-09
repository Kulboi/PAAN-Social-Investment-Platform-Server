import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { BrevoService } from './brevo.service';

interface DepositSuccessNotification {
  to: string;
  reference: string;
  balance: number;
}

interface DepositFailureNotification {
  to: string;
  reference: string;
}

@Injectable()
export class MailerService {
  private resend: Resend;
  private readonly logger = new Logger(MailerService.name);
  private readonly brevoService: BrevoService;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.brevoService = new BrevoService();
  }

  private async sendMail(to: string, subject: string, html: string) {
    const request = await this.resend.emails.send({
      from: 'noreply@peaceambassadorsng.com',
      to,
      subject,
      html,
    });

    return request;
  }

  async sendOTP(to: string, otp: string) {
    return await this.brevoService.sendEmail(to, 'Your PAAN Circle Verification OTP', `<h3>Your OTP is ${otp}</h3>`);
  }

  async sendForgotPasswordRequestToken(to: string, token: string) {
    return await this.brevoService.sendEmail(to, 'PAAN Circle Forgot Password Verification Token', `<h3>Your token is ${token}</h3>`);
  }

  async sendDepositSuccessNotification({to, reference, balance}: DepositSuccessNotification) {
    return await this.brevoService.sendEmail(
      to, 
      'Your PAAN Circle Deposit was successful', 
      `<h3>Your deposit of ${reference} was successful</h3>
      <p>Your balance has been updated to ${balance}</p>`
    );
  }

  async sendDepositFailureNotification({to, reference}: DepositFailureNotification) {
    return await this.brevoService.sendEmail(to, 'Your PAAN Circle Deposit was unsuccessful', `<h3>Your deposit of ${reference} was unsuccessful</h3>`);
  }
}