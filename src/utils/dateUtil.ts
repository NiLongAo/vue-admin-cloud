/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, { Dayjs } from 'dayjs';

const DATE_TIME = 'HH:mm:ss';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME,
): string {
  return dayjs(date).format(format);
}

export function stringToTime(date: string | undefined = undefined, format = DATE_TIME): Dayjs {
  return dayjs(date, format);
}

export const dateUtil = dayjs;
