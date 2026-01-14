import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenBlacklist } from 'src/auth/entities/token-blacklist.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([TokenBlacklist]),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, TypeOrmModule],
})
export class CommonModule {}