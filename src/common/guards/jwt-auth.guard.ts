import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

import { TokenBlacklist } from 'src/auth/entities/token-blacklist.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepo: Repository<TokenBlacklist>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    // Check if token is blacklisted
    if (token) {
      const isBlacklisted = await this.tokenBlacklistRepo.findOne({
        where: { token },
      });

      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been invalidated');
      }
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}