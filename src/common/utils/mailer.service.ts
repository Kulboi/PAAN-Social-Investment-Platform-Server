import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { BrevoService } from './brevo.service';
import { EmailTemplates } from './email-templates';

interface DepositSuccessNotification {
  to: string;
  reference: string;
  amount: number;
  balance: number;
  currency?: string;
}

interface DepositFailureNotification {
  to: string;
  reference: string;
  reason?: string;
}

interface CustomEmailOptions {
  to: string;
  subject: string;
  body: string;
  buttonText?: string;
  buttonLink?: string;
}

interface WaitlistConfirmation {
  to: string;
  fullname: string;
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
      from: 'noreply@paancircle.app',
      to,
      subject,
      html,
    });

    return request;
  }

  async sendOTP(to: string, otp: string) {
    const html = EmailTemplates.otpTemplate(otp);
    return await this.brevoService.sendEmail(to, 'Your PAAN Circle Verification OTP', html);
  }

  async sendForgotPasswordRequestToken(to: string, token: string, resetLink?: string) {
    const html = EmailTemplates.forgotPasswordTemplate(token, resetLink);
    return await this.brevoService.sendEmail(to, 'Reset Your PAAN Circle Password', html);
  }

  async sendDepositSuccessNotification({to, reference, amount, balance, currency = 'NGN'}: DepositSuccessNotification) {
    const html = EmailTemplates.depositSuccessTemplate(reference, amount, balance, currency);
    return await this.brevoService.sendEmail(
      to, 
      'Deposit Successful - PAAN Circle', 
      html
    );
  }

  async sendDepositFailureNotification({to, reference, reason}: DepositFailureNotification) {
    const html = EmailTemplates.depositFailureTemplate(reference, reason);
    return await this.brevoService.sendEmail(to, 'Deposit Failed - PAAN Circle', html);
  }

  async sendWaitlistConfirmation({to, fullname}: WaitlistConfirmation) {
    const html = EmailTemplates.waitlistConfirmationTemplate(fullname);
    return await this.brevoService.sendEmail(to, 'Welcome to PAAN Circle — Early Access Confirmed', html);
  }

  // Method for sending custom HTML emails
  async sendCustomEmail({to, subject, body, buttonText, buttonLink}: CustomEmailOptions) {
    const html = EmailTemplates.customTemplate(subject, body, buttonText, buttonLink);
    return await this.brevoService.sendEmail(to, subject, html);
  }

  // Method for sending raw HTML content
  async sendRawHtmlEmail(to: string, subject: string, htmlContent: string) {
    return await this.brevoService.sendEmail(to, subject, htmlContent);
  }
}