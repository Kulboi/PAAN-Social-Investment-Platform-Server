import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello() {
    return { message: 'Hello API' };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<any> {
    console.log('Validated Data:', dto);
    return await this.authService.register(dto);
  }
}
