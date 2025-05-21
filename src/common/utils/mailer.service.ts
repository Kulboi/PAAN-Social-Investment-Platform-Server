// re_QeLFdQHN_2ByhJdqQPKyRj4BvHS95tTBc
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    return await this.resend.emails.send({
      from: 'noreply@peaceambassadorsng.com',
      to,
      subject,
      html,
    });
  }

  async sendOTP(to: string, otp: string) {
    return await this.sendEmail(to, 'Your OTP', `Your OTP is ${otp}`);
  }
}