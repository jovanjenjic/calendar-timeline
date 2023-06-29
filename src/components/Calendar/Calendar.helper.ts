import {
  add,
  getDate,
  getMonth,
  addHours,
  format,
  isBefore,
  parseISO,
} from 'date-fns';
import {
  CellDisplayMode,
  CellDisplayModeState,
  CurrentView,
  DateInfo,
  PreparedDataWithoutTime,
  TimeFormat,
} from './Calendar.types';
import {
  dayInWeekBasedOnWeekStarts,
  formatFullDate,
  getAllDaysInMonth,
} from '@base/utils';
import { TimeDateFormat } from './Calendar.constants';

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
    case CurrentView.WEEK_TIME:
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

export const getTimeUnitString = (
  num: number,
  timeDateFormat: TimeFormat,
): string => {
  const date = addHours(0, num - 1);
  const label =
    num === 0
      ? format(
          date,
          timeDateFormat.hourTimeZone || TimeDateFormat.HOUR_TIMEZONE,
        )
      : format(date, timeDateFormat.hour || TimeDateFormat.HOUR);
  return label;
};

export const getKeyFromDateInfo = (dateInfo: DateInfo): string => {
  const key: string = dateInfo.date;

  return key;
};

export const shouldShowItem = (
  preparedDataItem: PreparedDataWithoutTime,
  dateKey: string,
  cellDisplayMode: CellDisplayMode,
  currentView: CurrentView,
  preparedData,
  currentDate: string,
): boolean => {
  let retValue = true;
  if (
    preparedDataItem.isStart ||
    cellDisplayMode[currentView].state === CellDisplayModeState.ALL_EXPANDED ||
    currentView !== CurrentView.MONTH
  ) {
    return true;
  }

  const calendarDays =
    cellDisplayMode[currentView].state === CellDisplayModeState.ALL_COLLAPSED
      ? getAllDaysInMonth(currentDate)
      : cellDisplayMode[currentView].inactiveCells;

  for (let i = 0; i < calendarDays.length && retValue; i++) {
    const dayCell = calendarDays[i];
    if (isBefore(parseISO(dateKey), parseISO(dayCell))) {
      retValue = true;
    } else if (dateKey !== dayCell) {
      const closedCellItems = preparedData[dayCell] || [];
      retValue = !closedCellItems.find(
        (item) => item.id === preparedDataItem.id,
      );
    }
  }

  return retValue;
};

export const shouldCollapse = (
  cellDisplayMode: CellDisplayMode,
  currentView: CurrentView,
  dateKey: string,
): boolean =>
  cellDisplayMode[currentView].state === CellDisplayModeState.ALL_COLLAPSED ||
  (cellDisplayMode[currentView].state === CellDisplayModeState.CUSTOM &&
    cellDisplayMode[currentView].inactiveCells.includes(dateKey));

export const calculatePosition = (
  startWeekDate: string,
  endWeekDate: string,
  startIntervalDate: string,
  endIntervalDate: string,
  weekStartsOn: number,
): string => {
  if (
    formatFullDate(new Date(startWeekDate)) >
      formatFullDate(new Date(endIntervalDate)) ||
    formatFullDate(new Date(endWeekDate)) <
      formatFullDate(new Date(startIntervalDate))
  ) {
    return '';
  }

  const startPosition = dayInWeekBasedOnWeekStarts(
    startWeekDate > startIntervalDate ? startWeekDate : startIntervalDate,
    weekStartsOn,
  );
  const endPosition = dayInWeekBasedOnWeekStarts(
    endWeekDate < endIntervalDate ? endWeekDate : endIntervalDate,
    weekStartsOn,
  );

  return startWeekDate === endWeekDate
    ? '1'
    : `${startPosition + 1} / ${endPosition + 2}`;
};
