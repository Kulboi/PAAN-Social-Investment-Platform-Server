import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WaitlistService } from './waitlist.service';
import { MailerService } from 'src/common/utils/mailer.service';
import { WaitlistController } from './waitlist.controller';

import { Waitlist } from './entities/waitlist.entity';

@Module({
  providers: [WaitlistService, MailerService],
  controllers: [WaitlistController],
  imports: [TypeOrmModule.forFeature([Waitlist])],
})
export class WaitlistModule {}
