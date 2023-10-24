import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
// Create a Day.js instance representing the current date
const currentDate = dayjs();
const dayFormat = 'YYYY-MM-DD HH:mm:ss';
const minNumber = 10000;
const maxNumber = 99999;
const durationString = '1h';
const subjectText = 'Welcome to Nice App! Confirm your Email';
const superPassword = configService.get<string>('PASSWORD_REGEXP');
const avaliableDate = dayjs().format('YYYY-MM-DD');

const constants = {
  currentDate,
  dayFormat,
  minNumber,
  maxNumber,
  durationString,
  subjectText,
  avaliableDate,
  superPassword,
};
export default constants;
