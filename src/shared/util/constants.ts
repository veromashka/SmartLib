import * as dayjs from 'dayjs';

// Create a Day.js instance representing the current date
const currentDate = dayjs();
const dayFormat = 'YYYY-MM-DD HH:mm:ss';
const minNumber = 10000;
const maxNumber = 99999;
const durationString = '1h';
const subjectText = 'Welcome to Nice App! Confirm your Email';

const constants = {
  currentDate,
  dayFormat,
  minNumber,
  maxNumber,
  durationString,
  subjectText,
};
export default constants;
