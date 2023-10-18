// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
//
// @Injectable()
// export class MailService {
//   constructor(private mailerService: MailerService) {}
//
//   async sendUserConfirmation(email: string, token: number) {
//     console.log('sendmail');
//     const output = `
//       <h1>Payment Confirmation</h1>
//       <p>Dear owner,</p>
//       <p>You got paid for access to LeaksHub platform form ${email}</p>
//       <p>Your secret number ${token}</p>
//       <p>Payment check is attached below</p>
//       <p>Sincerely,</p>
//       <p>Your LeaksHub </p>
//   `;
//     await this.mailerService.sendMail({
//       to: email,
//       from: 'grigorivveronika@gmail.com', // override default from
//       subject: 'Welcome to Nice App! Confirm your Email',
//       html: output,
//     });
//   }
// }
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'grigorivveronika@gmail.com',
        pass: 'dnyemvwnbcwgzelk',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(email: string, token: number) {
    const output = `
      <h1>Email Confirmation</h1>
      <p>Dear User,</p>
      <p>You signed up to SmartLib platform from ${email}</p>
      <p>Your secret number is: ${token}</p>
      <p>To continue registration please type this code in input</p>
      <p>Sincerely,</p>
      <p>Your SmartLib </p>
  `;
    const mailOptions = {
      from: 'grigorivveronika@gmail.com',
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      html: output,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true; // Email sent successfully
    } catch (error) {
      console.error('Email sending failed:', error);
      return false; // Email sending failed
    }
  }
}
