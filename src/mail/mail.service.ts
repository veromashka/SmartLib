import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const userEmail = this.configService.get<string>('EMAIL');
    const userPassword = this.configService.get<string>('PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: userPassword,
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
      throw new BadRequestException('Email sending failed:', error);
      return false; // Email sending failed
    }
  }
}
