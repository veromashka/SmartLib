import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import constants from '../shared/util/constants';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    public mailerService: MailerService
  ) {}

  async sendEmail(data): Promise<any> {
    if (data.type == 'notification') {
      await this.mailerService
        .sendMail({
          from: this.configService.get<string>('EMAIL'),
          to: data.email,
          subject: constants.notificationSubjectText,
          template: './notification',
          context: {
            login: data.login,
            bookTitle: data.bookTitle,
            finishDate: data.finishDate,
          },
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      await this.mailerService
        .sendMail({
          from: this.configService.get<string>('EMAIL'),
          to: data.email,
          subject: constants.confirmationSubjectText,
          template: './confirmation',
          context: { login: data.login, email: data.email, token: data.token },
        })
        .then(() => {
          console.log('success');
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }
}
