import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MailerService } from 'src/common/utils/mailer.service';

import { Waitlist } from './entities/waitlist.entity';

import { AddToWaitlistDtoRequest, AddToWaitlistDtoResponse } from './dto/add-to-waitlist.dto';
import { GetWaitlistDto } from './dto/get-waitlist.dto';
import { PaginationQueryDto, PaginatedResponseDto } from './dto/pagination.dto';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(Waitlist)
    private readonly waitlistRepository: Repository<Waitlist>,
    private readonly mailerService: MailerService,
  ) {}

  async addToWaitlist(payload: AddToWaitlistDtoRequest): Promise<AddToWaitlistDtoResponse> {
    const emailExists = await this.waitlistRepository.findOneBy({ email: payload.email });
    if (emailExists) {
      throw new ConflictException('Email already exists in waitlist');
    }

    const waitlistEntry = this.waitlistRepository.create({ email: payload.email, fullname: payload.fullname });
    await this.waitlistRepository.save(waitlistEntry);
    try {
      await this.mailerService.sendWaitlistConfirmation({ to: payload.email, fullname: payload.fullname });
    } catch (error) {
      console.error(error);
    }
    return { message: 'Successfully added to waitlist' };
  }

  async getWaitlist(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<GetWaitlistDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [data, total] = await this.waitlistRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
