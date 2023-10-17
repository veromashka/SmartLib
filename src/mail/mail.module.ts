import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [EmailService, ConfigService],
  exports: [EmailService], // 👈 export for DI
})
export class MailModule {}
