import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { BackOfficeUser } from './entities/back-office-user.entity';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';

@Injectable()
export class BackOfficeService {
  constructor(
    @InjectRepository(BackOfficeUser)
    private readonly backOfficeUserRepo: Repository<BackOfficeUser>,
  ) {}

  async createBackOfficeUser(payload: CreateBackOfficeUserRequestDto) {
    // check if user exists
    const userExists = await this.backOfficeUserRepo.findOneBy({
      email: payload.email,
    });

    if (userExists) {
      throw new ConflictException('Back office user with this email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // create back office user
    const backOfficeUser = this.backOfficeUserRepo.create({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      username: payload?.username,
      password: hashedPassword,
      role: payload?.role,
    });

    const createdBackOfficeUser = await this.backOfficeUserRepo.save(backOfficeUser);
    return {
      id: createdBackOfficeUser.id,
      first_name: createdBackOfficeUser.first_name,
      last_name: createdBackOfficeUser.last_name,
      email: createdBackOfficeUser.email,
      username: createdBackOfficeUser.username,
      role: createdBackOfficeUser.role,
      is_active: createdBackOfficeUser.is_active,
    };
  }

  async loginBackOfficeUser() {
    // To be implemented
  }
}
