function padZero(value) {
  return value.toString().padStart(2, "0");
}

export function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1);
  const day = padZero(now.getDate());
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  const weekday = now.getDay() + 1; // JavaScript的getDay()从0开始，所以加1得到1-7的星期几

  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    weekday,
  };
}

import dayjs from "dayjs";

/**
 * 判断给定日期字符串是否是星期四。
 * @param dateString - 格式为'YYYY-MM-DD HH:mm:ss'的日期字符串。
 * @returns 如果是今天且星期四则返回true，否则返回false。
 * @eg console.log(isTodayAndThursday('2024-02-03 08:05:12')); // 如果今天是周四，返回true，否则返回false
 * @变动的需求 填报时间限制改为周四上午9点-周五下午16点
 */
export function isTodayAndThursday(dateString?: string, day = [3, 5]): boolean {
  return isBetweenWednesday9amAndFriday4pm(dateString);
  const targetDate = dayjs(dateString, "YYYY-MM-DD HH:mm:ss"); // 将日期字符串转换为dayjs对象
  let today = targetDate.day(); // 获取传入的日期
  let hour = targetDate.hour();
  if (Array.isArray(day) && today >= day[0] && today <= day[1]) {
    // 如果是周四 增加10点的判断
    return (
      (today === day[0] && hour >= 9) ||
      (today === day[1] && hour < 16) ||
      (today < day[1] && today > day[0])
    );
  }
  // 检查时间是否相同
  return false;
}
function isBetweenWednesday9amAndFriday4pm(dateStr?: string): boolean {
  const date = new Date(dateStr);

  const day = date.getDay(); // 获取星期几（0-6，0代表星期天）
  const hour = date.getHours(); // 获取小时（0-23）

  // 判断是否在星期三到星期五的时间段内
  if (
    (day === 3 && hour >= 9) || // 星期三 9:00 到 23:59
    day === 4 || // 星期四 整天
    (day === 5 && hour < 16) // 星期五 0:00 到 16:00
  ) {
    return true;
  }

  return false; // 其他天
}

/**
 * 判断给定日期字符串是否是星期四。
 * @param dateString - 格式为'YYYY-MM-DD HH:mm:ss'的日期字符串。
 * @returns 如果是今天且星期四则返回true，否则返回false。
 * @eg console.log(isTodayAndThursday('2024-02-03 08:05:12')); // 如果今天是周四，返回true，否则返回false
 * @变动的需求 填报时间限制改为周四上午9点-周五下午16点
 */
export function isTodayAndWeekByDay(dateString?: string, day = 3): boolean {
  const targetDate = dayjs(dateString, "YYYY-MM-DD HH:mm:ss"); // 将日期字符串转换为dayjs对象
  // 检查时间是否相同
  return targetDate.day() === day;
}

// 字典转化
export function getCodeLabel(dictionaryArray, value) {
  for (let i = 0; i < dictionaryArray.length; i++) {
    if (dictionaryArray[i].value === value) {
      return dictionaryArray[i].label;
    }
    if (dictionaryArray[i].code === value) {
      return dictionaryArray[i].name;
    }
  }
  return value; // 如果未找到匹配value/code的 label/name，返回 null 或者其他你认为合适的默认值
}

// 获取当前年
export function getYear() {
  return new Date().getFullYear() + "";
}
