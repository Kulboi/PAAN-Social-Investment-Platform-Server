import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WebhookLoggerService {
  async log(provider: string, payload: any) {
    const logPath = path.join(__dirname, `../../../logs/${provider}-webhooks.log`);
    const logData = `\n[${new Date().toISOString()}] ${JSON.stringify(payload)}\n`;
    fs.appendFileSync(logPath, logData);
  }
}