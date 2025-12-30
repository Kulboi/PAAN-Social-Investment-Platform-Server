import { ConfigModule, ConfigService } from '@nestjs/config';
import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BackOfficeUser } from './back-office/entities/back-office-user.entity';

import { BackOfficeUsersSeeder } from './seeders/back-office-users.seeder';

seeder({
  imports: [
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
        entities: [BackOfficeUser],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([BackOfficeUser]),
  ],
}).run([BackOfficeUsersSeeder]);
