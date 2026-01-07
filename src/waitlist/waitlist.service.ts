import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Waitlist } from './entities/waitlist.entity';

import { AddToWaitlistDtoRequest, AddToWaitlistDtoResponse } from './dto/add-to-waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist)
    private readonly waitlistRepository: Repository<Waitlist>,
  ) {}

  async addToWaitlist(payload: AddToWaitlistDtoRequest): Promise<AddToWaitlistDtoResponse> {
    const emailExists = await this.waitlistRepository.findOneBy({ email: payload.email });
    if (emailExists) {
      throw new ConflictException('Email already exists in waitlist');
    }

    const waitlistEntry = this.waitlistRepository.create({ email: payload.email, fullname: payload.fullname });
    await this.waitlistRepository.save(waitlistEntry);
    return { message: 'Successfully added to waitlist' };
  }
}
