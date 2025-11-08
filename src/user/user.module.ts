import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Credential } from '../user/entities/credential.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credential])],
  providers: [UserService, CloudinaryService],
  controllers: [UserController]
})
export class UserModule {}
