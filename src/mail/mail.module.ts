import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async () => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: 'smtp.gmail.com',
          secure: true,
          auth: {
            user: 'grigorivveronika@gmail.com ',
            pass: 'dnyemvwnbcwgzelk',
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      // inject: [ConfigService],
    }),
  ],
  providers: [EmailService, ConfigService],
  exports: [EmailService], // 👈 export for DI
})
export class MailModule {}
