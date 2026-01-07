export class EmailTemplates {
  private static getBaseTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAAN Circle</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #4CAF50;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #4CAF50;
    }
    .content {
      padding: 30px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #4CAF50;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .highlight {
      background-color: #f0f0f0;
      padding: 15px;
      border-left: 4px solid #4CAF50;
      margin: 15px 0;
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
      letter-spacing: 2px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PAAN Circle</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PAAN Circle. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  static otpTemplate(otp: string): string {
    const content = `
      <h2>Verify Your Email Address</h2>
      <p>Thank you for signing up with PAAN Circle!</p>
      <p>Please use the following One-Time Password (OTP) to verify your email address:</p>
      <div class="highlight">
        <div class="code">${otp}</div>
      </div>
      <p>This OTP will expire in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `;
    return this.getBaseTemplate(content);
  }

  static forgotPasswordTemplate(token: string, resetLink?: string): string {
    const content = `
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your PAAN Circle password.</p>
      <p>Use the verification token below:</p>
      <div class="highlight">
        <div class="code">${token}</div>
      </div>
      ${
        resetLink
          ? `
        <p style="text-align: center;">
          <a href="${resetLink}" class="button">Reset Password</a>
        </p>
      `
          : ''
      }
      <p>This token will expire in <strong>30 minutes</strong>.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    `;
    return this.getBaseTemplate(content);
  }

  static depositSuccessTemplate(
    reference: string,
    amount: number,
    balance: number,
    currency: string = 'NGN',
  ): string {
    const content = `
      <h2>✓ Deposit Successful</h2>
      <p>Great news! Your deposit has been successfully processed.</p>
      <div class="highlight">
        <p><strong>Transaction Reference:</strong> ${reference}</p>
        <p><strong>Amount Deposited:</strong> ${currency} ${amount.toLocaleString()}</p>
        <p><strong>New Balance:</strong> ${currency} ${balance.toLocaleString()}</p>
      </div>
      <p>Your funds are now available in your wallet and ready to use for investments.</p>
      <p>Thank you for choosing PAAN Circle!</p>
    `;
    return this.getBaseTemplate(content);
  }

  static depositFailureTemplate(reference: string, reason?: string): string {
    const content = `
      <h2>Deposit Failed</h2>
      <p>We're sorry, but your recent deposit could not be processed.</p>
      <div class="highlight">
        <p><strong>Transaction Reference:</strong> ${reference}</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>
      <p>Please check your payment details and try again. If the problem persists, please contact our support team.</p>
      <p style="text-align: center;">
        <a href="mailto:support@paancircle.app" class="button">Contact Support</a>
      </p>
    `;
    return this.getBaseTemplate(content);
  }

  static waitlistConfirmationTemplate(fullname: string): string {
    const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>PAAN Circle Waitlist Confirmation</title>
        </head>
        <body style="margin:0; padding:0; background-color:#F8FAFC; font-family:Arial, Helvetica, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center" style="padding:40px 16px;">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF; border-radius:8px; padding:32px;">
                  
                  <!-- Logo / Header -->
                  <tr>
                    <td align="center" style="padding-bottom:24px;">
                      <h1 style="margin:0; font-size:24px; color:#0F172A; font-weight:600;">
                        Welcome to PAAN Circle!
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="font-size:16px; line-height:1.6; color:#475569;">
                      <p style="margin:0 0 16px 0;">
                        Hi ${fullname},
                      </p>

                      <p style="margin:0 0 16px 0;">
                        Thanks for joining the <strong>PAAN Circle waitlist</strong>.
                      </p>

                      <p style="margin:0 0 24px 0;">
                        You’re now among the first to receive updates about the PAAN App — a digital investment and networking platform designed to bring ambassadors, professionals, and investors together in one trusted community.
                      </p>

                      <h3 style="margin:0 0 12px 0; font-size:18px; color:#0F172A;">
                        What to expect next
                      </h3>

                      <ul style="padding-left:20px; margin:0 0 24px 0;">
                        <li>Launch updates and early access announcements</li>
                        <li>Invitations to explore curated investment opportunities</li>
                        <li>Access to exclusive community forums and discussions</li>
                      </ul>

                      <p style="margin:0 0 24px 0;">
                        We’ll notify you as soon as early access becomes available.
                      </p>

                      <p style="margin:0;">
                        Welcome to the PAAN Circle community,<br />
                        <strong>The PAAN Circle Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding:24px 0;">
                      <hr style="border:none; border-top:1px solid #E5E7EB;" />
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="font-size:12px; line-height:1.5; color:#64748B;">
                      <p style="margin:0;">
                        PAAN does not provide financial advice. Investment opportunities involve risk. Please review applicable terms before participating.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
    return this.getBaseTemplate(content);
  }

  static customTemplate(
    subject: string,
    body: string,
    buttonText?: string,
    buttonLink?: string,
  ): string {
    const content = `
      <h2>${subject}</h2>
      ${body}
      ${
        buttonText && buttonLink
          ? `
        <p style="text-align: center;">
          <a href="${buttonLink}" class="button">${buttonText}</a>
        </p>
      `
          : ''
      }
    `;
    return this.getBaseTemplate(content);
  }
}
