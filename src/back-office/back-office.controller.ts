import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { BackOfficeService } from './back-office.service';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';
import { CreateBackOfficeUserResponseDto } from './dto/create-back-office-user-response.dto';

@Controller('back-office')
@ApiTags('Back Office')
export class BackOfficeController {
  constructor(private readonly backOfficeService: BackOfficeService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register back office user' })
  @ApiBody({ type: CreateBackOfficeUserRequestDto })
  @ApiResponse({ 
    status: 201,
    description: 'The back office user has been successfully created.',
    type: CreateBackOfficeUserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Back office user with this email already exists' })
  async register(@Body() payload: CreateBackOfficeUserRequestDto) {
    return this.backOfficeService.createBackOfficeUser(payload);
  }
}
