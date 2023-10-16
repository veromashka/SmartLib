import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';

@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService], // 👈 export for DI
})
export class MailModule {}
