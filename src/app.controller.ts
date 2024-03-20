import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Get('getHello')
  async getHello(): Promise<any> {
    return 'Hello';
  }
}
