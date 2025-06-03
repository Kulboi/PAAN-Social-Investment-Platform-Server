import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async getUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['credentials'] });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Current password is incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    await this.userRepo.remove(user);
    return { message: 'User deleted successfully' };
  }
}