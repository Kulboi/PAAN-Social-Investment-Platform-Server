import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

import { Verification } from '../../auth/entities/verification.entity';

@Injectable()
export class OtpCleanupService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepo: Repository<Verification>
  ) {}

  @Cron('0 */30 * * * *') // Every 30 minutes
  async handleCleanup() {
    const now = new Date();
    await this.verificationRepo.delete({ expiresAt: LessThan(now) });
  }
}