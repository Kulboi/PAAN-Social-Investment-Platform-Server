import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserTypes } from './user.enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['credentials'],
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      address: user.address,
      lga: user.lga,
      state: user.state,
      phone: user.phone,
      country: user.country,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      profile_image: user.profile_image,
      is_verified: user.is_verified,
      credentials: {
        nin: user?.credentials?.nin,
        bvn: user?.credentials?.bvn,
      },
      role: user.role as UserTypes,
    };
  }

  async updateUser(id: string, payload: UpdateUserDto): Promise<{ message: string; data: UserResponseDto }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, payload);
    await this.userRepo.save(user);

    return {
      message: 'User updated successfully',
      data: {
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        lga: user.lga,
        state: user.state,
        phone: user.phone,
        country: user.country,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        profile_image: user.profile_image,
        is_verified: user.is_verified,
        role: user.role as UserTypes,
        credentials: {
          nin: user?.credentials?.nin,
          bvn: user?.credentials?.bvn,
        },
      },
    };
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('Current password is incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.remove(user);
    return { message: 'User deleted successfully' };
  }
}
