import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { BrevoService } from './brevo.service';

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
}