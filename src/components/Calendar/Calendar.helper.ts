import {
  add,
  getDate,
  getMonth,
  startOfWeek,
  addHours,
  eachDayOfInterval,
  format,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { CurrentView, DateInfo, TimeFormat } from './Calendar.types';
import { formatFullDateTime } from '@base/utils';

export const getNextTimeUnit = (
  currentView: CurrentView,
  date: Date,
): number => {
  let nextTimeUnit;

  switch (currentView) {
    case CurrentView.MONTH:
      nextTimeUnit = getMonth(add(date, { months: 1 }));
      break;
    case CurrentView.WEEK:
    case CurrentView.WEEK_HOURS:
      nextTimeUnit = getDate(add(date, { weeks: 1 }));
      break;
    case CurrentView.DAY:
      nextTimeUnit = getDate(add(date, { days: 1 }));
      break;
    default:
      break;
  }

  return nextTimeUnit;
};

export const addTimeUnit = (
  currentView: CurrentView,
  date: Date,
  day: number,
  startOfWeekOptions: { weekStartsOn },
): number => {
  let nextTimeUnit;

  switch (currentView) {
    case CurrentView.MONTH:
      nextTimeUnit = getMonth(
        startOfWeek(add(date, { days: day }), startOfWeekOptions),
      );
      break;
    case CurrentView.WEEK:
    case CurrentView.WEEK_HOURS:
      nextTimeUnit = getDate(
        startOfWeek(add(date, { days: day }), startOfWeekOptions),
      );
      break;
    case CurrentView.DAY:
      nextTimeUnit = getDate(add(date, { days: day }));
      break;
    default:
      break;
  }

  return nextTimeUnit;
};

export const getTimeUnitString = (
  num: number,
  timeDateFormat: TimeFormat,
): string => {
  const date = addHours(0, num - 1);
  const label =
    num === 0
      ? format(date, timeDateFormat.hourTimeZone)
      : format(date, timeDateFormat.hour);
  return label;
};

export const getKeyFromDateInfo = (
  currentView,
  dateInfo: DateInfo,
  hour: number,
): string => {
  let key: string = dateInfo.date;

  if (
    currentView === CurrentView.WEEK_HOURS ||
    currentView === CurrentView.DAY
  ) {
    const currentHour: Date = add(new Date(`${dateInfo.date} 00:00:00`), {
      hours: hour,
    });
    key = formatFullDateTime(currentHour);
  }

  return key;
};

export const getAllDaysInMonth = (dateString) => {
  const daysOfMonth = eachDayOfInterval({
    start: startOfMonth(new Date(dateString)),
    end: endOfMonth(new Date(dateString)),
  }).map((day) => format(day, 'yyyy-MM-dd'));

  return daysOfMonth;
};
