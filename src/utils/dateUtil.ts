/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, { Dayjs } from 'dayjs';

const DATE_TIME = 'HH:mm:ss';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
export { DATE_TIME, DATE_TIME_FORMAT, DATE_FORMAT };

export function formatToDateTime(
  date?: dayjs.ConfigType | string,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME,
): string {
  return dayjs(date).format(format);
}

export function stringToFormatString(
  date: string | undefined = undefined,
  oldFormat = DATE_TIME_FORMAT,
  newFormat = DATE_TIME,
): string {
  return dayjs(dayjs(date, oldFormat)).format(newFormat);
}

export function stringToTime(date: string | undefined = undefined, format = DATE_TIME): Dayjs {
  return dayjs(date, format);
}

//将字符串时间转化为 时分秒 时间戳
export function stringFormatTime(date: string, format = DATE_TIME_FORMAT): number {
  const obj = stringToTime(date, format);
  const hour = obj.hour();
  const minute = obj.minute();
  const second = obj.second();
  const timestamp = hour * 3600 + minute * 60 + second;
  return timestamp;
}

//将时分秒时间戳转化为字符串小时时间
export function tipFormatter(val: number | undefined) {
  if (val == undefined) {
    return val;
  }
  let h = parseInt(val / 3600);
  let m = parseInt((val - h * 3600) / 60);
  let s = parseInt(val - h * 3600 - m * 60);
  let hStr: string = h.toString();
  let mStr: string = m.toString();
  let sStr: string = s.toString();
  if (h < 10) {
    hStr = '0' + hStr;
  }
  if (m < 10) {
    mStr = '0' + mStr;
    s;
  }
  if (s < 10) {
    sStr = '0' + sStr;
  }
  return hStr + ':' + mStr + ':' + sStr;
}

export const dateUtil = dayjs;
