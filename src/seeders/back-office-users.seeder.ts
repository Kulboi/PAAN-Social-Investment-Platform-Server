import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { BackOfficeUser } from './../back-office/entities/back-office-user.entity';

import BackOfficeUserRoleTypes from './../back-office/enums/back-office-user-role-types.enum';

@Injectable()
export class BackOfficeUsersSeeder implements Seeder {
  constructor(
    @InjectRepository(BackOfficeUser)
    private readonly userRepository: Repository<BackOfficeUser>,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<any> {
    const hashedPassword = await bcrypt.hash(this.configService.get<string>('BACK_OFFICE_SEEDER_PASSWORD'), 10);

    const superAdminUser = this.userRepository.create({
      first_name: 'Super',
      last_name: 'Admin',
      email: this.configService.get<string>('BACK_OFFICE_SEEDER_EMAIL'),
      username: this.configService.get<string>('BACK_OFFICE_SEEDER_USERNAME'),
      password: hashedPassword,
      role: BackOfficeUserRoleTypes.SUPER_ADMIN,
      is_active: true,
    });

    return this.userRepository.save(superAdminUser);
  }

  async drop(): Promise<any> {
    return this.userRepository.createQueryBuilder('backOfficeUser').delete().execute();
  }
}