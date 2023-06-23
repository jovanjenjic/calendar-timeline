import { TimeDateFormat } from '@base/components/Calendar/Calendar.constants';
import { WeekStartsOn } from '@base/components/Calendar/Calendar.types';
import {
  differenceInDays,
  differenceInHours,
  add,
  getDay,
  format,
  parse,
  startOfDay,
  startOfHour,
} from 'date-fns';

/**
 * Transforms `date` to a string of this format: "yyyy-MM-dd",
 * e.g. "2023-05-21". It uses date and time formats that 'date-fns'
 * library understands. For more info, please visit:
 * https://date-fns.org/v2.30.0/docs/format
 * @param date Date to convert to a string.
 */
export const formatFullDate = (date: Date): string =>
  format(date, TimeDateFormat.FULL_DATE);

export const formatFullDateTime = (date: Date): string =>
  format(date, TimeDateFormat.FULL_DATE_TIME);

/**
 * Transforms `date` to a string of this format: "MMMM yyyy",
 * e.g. "May 2023". It uses date and time formats that 'date-fns'
 * library understands. For more info, please visit:
 * https://date-fns.org/v2.30.0/docs/format
 * @param date Date to convert to a string.
 */
export const formatMonthAndYear = (date: Date): string =>
  format(date, TimeDateFormat.MONTH_YEAR);

/**
 * Transforms `date` to a string of this format: "EEE",
 * e.g. "Mon" or "Tue". It uses date and time formats that
 * 'date-fns' library understands. For more info, please visit:
 * https://date-fns.org/v2.30.0/docs/format
 * @param date Date to convert to a string.
 */
export const formatShortWeekday = (date: Date): string =>
  format(date, TimeDateFormat.SHORT_WEEKDAY);

/**
 * Parses a string of this date format "yyyy-MM-dd" to a Date.
 * It uses date and time formats that 'date-fns' library understands.
 * For more info, please visit: https://date-fns.org/v2.30.0/docs/format
 * @param timeDate String in format "yyyy-MM-dd" to be parsed as a Date object.
 */
export const parseFullDate = (timeDate: string): Date =>
  parse(timeDate, TimeDateFormat.FULL_DATE, new Date());

/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar
 * @param calendarData - Array of data for calendar view
 * @param activeViewConfiguration - Configuration for calendar view
 * @returns - Prepared array of data for calendar view
 */
export const prepareCalendarDataWeekHours = (
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
): Record<string, Record<string, any>[]> => {
  const result = {};
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (
    activeTimeDateField ?? ''
  )
    .split('-')
    .map((str) => str.replace(/\s/g, ''));

  // A sorted array based on the date and time that was selected within configurations
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  for (const obj of sortedCalendarValue) {
    const startDate = new Date(obj?.[startIntervalKey]);
    const roundedStartTime = startOfHour(startDate);

    // Item can have an end interval, if it doesn't then it is the same as the start interval
    const endDate = new Date(obj?.[endIntervalKey]);
    const roundedEndTime = startOfHour(endDate);

    2;
    const numberOfHours = differenceInHours(
      startOfHour(roundedEndTime),
      startOfHour(roundedStartTime),
    );

    // The goal is to go through all the days that exist between the start and end value
    // of the interval for the current item (most often it is only one)
    for (let i = 0; i <= numberOfHours; i++) {
      const nextHour = add(roundedStartTime, { hours: i });
      const key: string = formatFullDateTime(nextHour);

      const res = {
        ...obj,
        length: 1,
        row: +format(nextHour, 'HH') + 1,
        keykey: key,
      };
      result[key] = [...(result[key] || []), res];
    }
  }

  return result;
};

/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar
 * @param calendarData - Array of data for calendar view
 * @param activeViewConfiguration - Configuration for calendar view
 * @returns - Prepared array of data for calendar view
 */
export const prepareCalendarData = (
  calendarData: Record<string, any>[],
  activeTimeDateField: any,
  weekStartsOn: WeekStartsOn,
): Record<string, Record<string, any>[]> => {
  const result = {};
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (
    activeTimeDateField ?? ''
  )
    .split('-')
    .map((str) => str.replace(/\s/g, ''));

  // A sorted array based on the date and time that was selected within configurations
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  for (const obj of sortedCalendarValue) {
    const startDate: Date = new Date(obj?.[startIntervalKey]);
    // Item can have an end interval, if it doesn't then it is the same as the start interval
    const endDate: Date = new Date(obj?.[endIntervalKey]);
    const startDateModified = startOfDay(new Date(startDate));
    const endDateModified = startOfDay(new Date(endDate));

    const numberOfDays: number = differenceInDays(
      endDateModified,
      startDateModified,
    );

    // The goal is to go through all the days that exist between the start and end value
    // of the interval for the current item (most often it is only one)
    for (let i = 0; i <= numberOfDays; i++) {
      const nextDay = add(startDate, { days: i });
      const key: string = formatFullDate(nextDay);

      // The first in a series of iterations. We started from him
      const isStartInterval: boolean = key === formatFullDate(startDate);

      // If the interval is large enough to continue in the next week. day() returns serial number of day in week
      const isNextWeek: boolean = getDay(nextDay) === (weekStartsOn ?? 1);

      if (isStartInterval || isNextWeek) {
        const res = {
          ...obj,
          isStart: isStartInterval,
          // Based on a longer interval, the component will be set to that interval of days.
          // At most, it can span seven days (week === 7 days) in one row, after which it continues in the next row
          length: isNextWeek
            ? Math.min(7, numberOfDays - i + 1)
            : Math.min(7, numberOfDays + 1),
        };
        result[key] = [...(result[key] || []), res];
      }
    }
  }

  return result;
};
