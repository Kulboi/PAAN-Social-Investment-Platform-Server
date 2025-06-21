import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BrevoService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY
    this.apiUrl = process.env.BREVO_API_URL
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const apiKey = this.apiKey;
      const apiUrl = this.apiUrl || "https://api.brevo.com/v3/smtp/email";
      const response = await axios.post(
        apiUrl,
        {
          sender: {
            name: "PAAN Circle",
            email: "noreply@paancircle.app",
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        }
      );
      console.log("Email sent:", response.data);
    } catch (error: any) {
      console.error("Error sending email:", error.response?.data || error.message);
      throw new Error("Failed to send email");
    }
  }
}