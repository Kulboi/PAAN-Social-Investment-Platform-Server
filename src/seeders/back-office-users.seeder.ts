import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { faker } from '@faker-js/faker';

import { BackOfficeUser } from './../back-office/entities/back-office-user.entity';

import BackOfficeUserRoleTypes from './../back-office/enums/back-office-user-role-types.enum';

@Injectable()
export class BackOfficeUsersSeeder implements Seeder {
  constructor(
    @InjectRepository(BackOfficeUser)
    private readonly userRepository: Repository<BackOfficeUser>,
  ) {}

  async seed(): Promise<any> {
    // const users = Array.from({ length: 2 }).map(() => {
    //   return this.userRepository.create({
    //     first_name: faker.person.firstName(),
    //     last_name: faker.person.lastName(),
    //     email: faker.internet.email(),
    //     username: faker.internet.userName(),
    //     password: faker.internet.password({ length: 10 }),
    //     role: BackOfficeUserRoleTypes.SUPER_ADMIN,
    //     is_active: true,
    //   });
    // });

    const superAdminUser = this.userRepository.create({
      first_name: 'Super',
      last_name: 'Admin',
      email: 'super_admin@paancircle.app',
      username: 'superadmin',
      password: 'Paancircle@256!',
      role: BackOfficeUserRoleTypes.SUPER_ADMIN,
      is_active: true,
    });

    return this.userRepository.save(superAdminUser);
  }

  async drop(): Promise<any> {
    return this.userRepository.createQueryBuilder('backOfficeUser').delete().execute();
  }
}