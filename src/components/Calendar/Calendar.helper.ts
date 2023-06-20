import {
  add,
  getDate,
  getMonth,
  startOfWeek,
  addHours,
  format,
} from 'date-fns';
import { CurrentView } from './Calendar.types';

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
  startOfWeekOptions: { weekStartsOn: 1 | 0 },
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

export const getTimeUnitString = (num: number): string => {
  const date = addHours(0, num);
  const label = num === -1 ? format(date, 'z') : format(date, 'ha');
  return label;
};
