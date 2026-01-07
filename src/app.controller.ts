import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags('App')
@Controller('')
export class AppController {
  @ApiOperation({ summary: 'Get welcome message' })
  @Get()
  getHello(): string {
    return "Welcome to PAAN API Server";
  }
}