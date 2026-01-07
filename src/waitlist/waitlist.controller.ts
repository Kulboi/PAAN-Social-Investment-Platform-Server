import { Controller, HttpStatus, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { WaitlistService } from './waitlist.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

import { AddToWaitlistDtoRequest, AddToWaitlistDtoResponse } from './dto/add-to-waitlist.dto';
import { GetWaitlistDto } from './dto/get-waitlist.dto';
import { PaginationQueryDto, PaginatedResponseDto } from './dto/pagination.dto';

@Controller('/api/v1/waitlist')
@ApiTags('Waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add user to waitlist' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully added to waitlist', type: AddToWaitlistDtoResponse })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists in waitlist' })
  async addToWaitlist(@Body() payload: AddToWaitlistDtoRequest): Promise<AddToWaitlistDtoResponse> {
    return this.waitlistService.addToWaitlist(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get waitlist with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Waitlist retrieved successfully' })
  async getWaitlist(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<GetWaitlistDto>> {
    return this.waitlistService.getWaitlist(paginationQuery);
  }
}
