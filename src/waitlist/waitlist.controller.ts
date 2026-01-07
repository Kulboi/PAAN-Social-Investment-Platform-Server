import { Controller, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { WaitlistService } from './waitlist.service';

import { AddToWaitlistDtoRequest, AddToWaitlistDtoResponse } from './dto/add-to-waitlist.dto';

@Controller('waitlist')
@ApiTags('Waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @ApiOperation({ summary: 'Add user to waitlist' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully added to waitlist', type: AddToWaitlistDtoResponse })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists in waitlist' })
  async addToWaitlist(payload: AddToWaitlistDtoRequest): Promise<AddToWaitlistDtoResponse> {
    return this.waitlistService.addToWaitlist(payload);
  }
}
