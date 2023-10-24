import * as dayjs from 'dayjs';
import constants from './constants';

const currentDate = dayjs();
export async function newExpDate(durationString: string): Promise<Date> {
  const match = durationString.match(/(\d+)([smhdwMy]|ms)/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];

    let newDate;

    if (unit === 's') {
      newDate = await currentDate.add(value, 'second');
    } else if (unit === 'm') {
      newDate = await currentDate.add(value, 'minute');
    } else if (unit === 'h') {
      newDate = await currentDate.add(value, 'hour');
    } else if (unit === 'd') {
      newDate = await currentDate.add(value, 'day');
    } else if (unit === 'w') {
      newDate = await currentDate.add(value, 'week');
    } else if (unit === 'M') {
      newDate = await currentDate.add(value, 'month');
    } else if (unit === 'y') {
      newDate = await currentDate.add(value, 'year');
    } else {
      console.error('Invalid duration unit.');
    }
    // console.log(newDate.format(dayFormat));

    return newDate.format(constants.dayFormat); // Return the formatted date as a locale-specific time string
  } else {
    console.error('Invalid duration format.');
  }
}
