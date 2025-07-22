import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Strategies
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { RtStrategy } from './common/strategies/rt.strategy';

// Modules
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { WalletModule } from './wallet/wallet.module';

import { AppController } from './app.controller';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') === 'development' ? true : false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    WalletModule,
    FollowModule,
  ],
  providers: [JwtStrategy, RtStrategy],
  controllers: [AppController],
})

export class AppModule {}