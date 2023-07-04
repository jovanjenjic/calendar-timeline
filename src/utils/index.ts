import { TimeDateFormat } from '../components/Calendar/Calendar.constants';
import { calculateStartAndEndMinute } from '../components/Calendar/Calendar.helper';
import {
  PreparedDataWithTime,
  PreparedDataWithTimeFull,
  PreparedDataWithTimeInPlace,
  PreparedDataWithoutTime,
  WeekStartsOn,
} from '../components/Calendar/Calendar.types';
import {
  differenceInDays,
  add,
  getDay,
  format,
  startOfDay,
  differenceInMinutes,
  endOfDay,
  isEqual,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfHour,
} from 'date-fns';

export const formatFullDate = (date: Date): string =>
  format(date, TimeDateFormat.FULL_DATE);

export const formatFullDateTime = (date: Date): string =>
  format(date, TimeDateFormat.FULL_DATE_TIME);

export const formatHour = (date: Date): string =>
  format(date, TimeDateFormat.HOUR_MINUTE);

export const formatMonthDayHour = (date: Date): string =>
  format(date, TimeDateFormat.MONTH_DAY_HOUR);

export const dayInWeekBasedOnWeekStarts = (
  timeDate: string,
  weekStartsOn = 1,
): number => {
  return (getDay(new Date(timeDate)) - (weekStartsOn || 0) + 7) % 7;
};

export const getAllDaysInMonth = (month) => {
  const daysOfMonth = eachDayOfInterval({
    start: startOfMonth(new Date(month)),
    end: endOfMonth(new Date(month)),
  }).map((day) => format(day, 'yyyy-MM-dd'));

  return daysOfMonth;
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
  activeTimeDateField: string,
  weekStartsOn: WeekStartsOn,
): Record<string, PreparedDataWithoutTime[]>[] => {
  const result = {} as Record<string, PreparedDataWithoutTime[]>[];
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
    const startDateValue = obj?.[startIntervalKey];
    const endDateValue = obj?.[endIntervalKey];

    if (!startDateValue || !endDateValue) continue;

    const startDate: Date = new Date(startDateValue);
    // Item can have an end interval, if it doesn't then it is the same as the start interval
    const endDate: Date = new Date(endDateValue);
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

const processMatchingItems = (
  result: PreparedDataWithTimeFull,
  secondDayKey: string,
  secondDayRes: PreparedDataWithTime,
): void => {
  const matchingItems = result.day[secondDayKey]?.filter((item) => {
    return (
      +item.startMinute >= +secondDayRes.startMinute - 30 &&
      +item.startMinute <= +secondDayRes.startMinute + 30
    );
  });

  if (matchingItems && matchingItems.length > 1) {
    const numberInRow = matchingItems.length;

    const calculateWidth = () => {
      return (2 / (numberInRow + 1)) * 100 + '%';
    };

    const calculateLeft = (index) => {
      return (1 / (numberInRow + 1)) * 100 * index + '%';
    };

    matchingItems.forEach((item, index) => {
      item.numberInRow = numberInRow;
      item.width = `calc(${calculateWidth()} - ${numberInRow * 2}%)`;
      item.left = calculateLeft(index);
      item.margin =
        (index === 0 && `0 0 0 ${numberInRow * 2}%`) ||
        (index === numberInRow - 1 && `0 ${numberInRow * 2}% 0 0`);
    });
  }
};

export const prepareCalendarDataWithTime = (
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
): PreparedDataWithTimeFull => {
  const result = {
    week: [] as PreparedDataWithTime[],
    day: {} as Record<string, PreparedDataWithTime>[],
  };
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (
    activeTimeDateField ?? ''
  )
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  sortedCalendarValue.forEach((obj) => {
    const startDateValue = obj?.[startIntervalKey];
    const endDateValue = obj?.[endIntervalKey];

    if (!startDateValue || !endDateValue) return;

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    const numberOfMinutes = differenceInMinutes(endDate, startDate);

    const key: string = formatFullDate(startDate);

    const res: PreparedDataWithTime = {
      ...obj,
      startMinute: 0,
      endMinute: 0,
    };

    if (numberOfMinutes > 24 * 60) {
      result.week = [...(result.week || []), res];
    } else if (differenceInMinutes(endDate, startOfDay(startDate)) > 24 * 60) {
      const firstDayEnd = endOfDay(startDate);
      const secondDayStart = startOfDay(endDate);

      const { startMinute, endMinute } = calculateStartAndEndMinute(
        startDate,
        firstDayEnd,
      );
      const firstDayRes = {
        ...res,
        startMinute,
        endMinute,
      };

      const startAndEndMinutSecondItem = calculateStartAndEndMinute(
        secondDayStart,
        endDate,
      );
      const secondDayKey: string = formatFullDate(secondDayStart);
      const secondDayRes = {
        ...res,
        fromPreviousDay: true,
        startMinute: startAndEndMinutSecondItem.startMinute,
        endMinute: startAndEndMinutSecondItem.endMinute,
      };
      result.day[key] = [...(result.day[key] || []), firstDayRes];
      result.day[secondDayKey] = [
        ...(result.day[secondDayKey] || []),
        secondDayRes,
      ];
      processMatchingItems(result, secondDayKey, secondDayRes);
      processMatchingItems(result, key, firstDayRes);
    } else {
      const { startMinute, endMinute } = calculateStartAndEndMinute(
        startDate,
        endDate,
      );
      const expendedRes = {
        ...res,
        startMinute,
        endMinute: endMinute == startMinute ? endMinute + 30 : endMinute,
      };
      result.day[key] = [...(result.day[key] || []), expendedRes];
      processMatchingItems(result, key, expendedRes);
    }
  });

  return result;
};

export const prepareCalendarDataInPlace = (
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
): PreparedDataWithTimeInPlace => {
  const result = {};
  const [startIntervalKey] = (activeTimeDateField ?? '')
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

  // A sorted array based on the date and time that was selected within configurations
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  for (const obj of sortedCalendarValue) {
    const startDateValue = obj?.[startIntervalKey];
    if (!startDateValue) continue;

    const startDate = new Date(startDateValue);
    const roundedStartTime = startOfHour(startDate);

    const key: string = formatFullDateTime(roundedStartTime);

    result[key] = [...(result[key] || []), obj];
  }

  return result;
};

export const isEqualValues = (value, other) => {
  // Provera jednakosti za primitivne vrednosti
  if (value === other) {
    return true;
  }

  // Provera tipova
  const typeValue = typeof value;
  const typeOther = typeof other;
  if (typeValue !== typeOther) {
    return false;
  }

  // Provera specifičnih slučajeva
  if (value === null || other === null || typeValue !== 'object') {
    return false;
  }

  // Provera jednakosti za objekte i nizove
  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) {
    return false;
  }

  for (const key of valueKeys) {
    if (!isEqual(value[key], other[key])) {
      return false;
    }
  }

  return true;
};

export const isEmptyObject = (value) => {
  if (value == null) {
    return true;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

export const omit = (object, paths) => {
  const result = {};
  const omitPaths = Array.isArray(paths) ? paths : [paths];

  for (const key in object) {
    if (!omitPaths.includes(key)) {
      result[key] = object[key];
    }
  }

  return result;
};
