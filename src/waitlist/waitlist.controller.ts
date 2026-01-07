import { Controller } from '@nestjs/common';

import { WaitlistService } from './waitlist.service';

import { AddToWaitlistDtoRequest, AddToWaitlistDtoResponse } from './dto/add-to-waitlist.dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  async addToWaitlist(payload: AddToWaitlistDtoRequest): Promise<AddToWaitlistDtoResponse> {
    return this.waitlistService.addToWaitlist(payload);
  }
}
