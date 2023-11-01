import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Cron } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @UseGuards(JwtAuthGuard)
  @Get('getHello')
  async getHello(): Promise<any> {
    return 'Hello';
  }
}
