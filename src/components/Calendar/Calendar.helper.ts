import {
  add,
  addHours,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  startOfWeek,
} from 'date-fns';
import {
  CalculateStartAndEndMinuteFunc,
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
  formatFullDateTime,
  getAllDaysInMonth,
} from '../../utils/index';
import { TimeDateFormat } from './Calendar.constants';

export const getTimeUnitString = (
  num: number,
  timeDateFormat: TimeFormat,
): string => {
  const date = addHours(0, num - 1);
  const label = format(date, timeDateFormat.hour || TimeDateFormat.HOUR);
  return label;
};

export const getKeyFromDateInfo = (
  dateInfo: DateInfo,
  hour: number,
): string => {
  const currentHour: Date = add(new Date(`${dateInfo.date} 00:00:00`), {
    hours: hour,
  });

  return formatFullDateTime(currentHour);
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
    cellDisplayMode[currentView]?.state === CellDisplayModeState.ALL_EXPANDED ||
    currentView !== CurrentView.MONTH
  ) {
    return true;
  }

  const calendarDays =
    cellDisplayMode[currentView]?.state === CellDisplayModeState.ALL_COLLAPSED
      ? getAllDaysInMonth(currentDate)
      : cellDisplayMode[currentView]?.inactiveCells;

  for (let i = 0; i < calendarDays?.length && retValue; i++) {
    const dayCell = calendarDays[i];
    if (formatFullDate(new Date(dateKey)) < formatFullDate(new Date(dayCell))) {
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
  cellDisplayMode[currentView]?.state === CellDisplayModeState.ALL_COLLAPSED ||
  (cellDisplayMode[currentView]?.state === CellDisplayModeState.CUSTOM &&
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

export const isFromPreviousOrNextDateUnit = (
  startDate: string,
  endDate: string,
  startIntervalDate: string,
  endIntervalDate: string,
  currentView: CurrentView,
  weekStartsOn,
): boolean[] => {
  const response = [false, false];
  if (currentView === CurrentView.DAY) {
    response[0] =
      formatFullDate(new Date(startIntervalDate)) <
      formatFullDate(new Date(startDate));

    response[1] =
      formatFullDate(new Date(endIntervalDate)) >
      formatFullDate(new Date(endDate));
  } else {
    response[0] =
      formatFullDate(new Date(startIntervalDate)) <
      formatFullDate(startOfWeek(new Date(startDate), { weekStartsOn }));

    response[1] =
      formatFullDate(new Date(endIntervalDate)) >
      formatFullDate(endOfWeek(new Date(startDate), { weekStartsOn }));
  }
  return response;
};

export const calculateStartAndEndMinute = (
  startDate: Date,
  endDate: Date,
): CalculateStartAndEndMinuteFunc => {
  const startMinute = getHours(startDate) * 60 + getMinutes(startDate) || 1;
  const endMinute = getHours(endDate) * 60 + getMinutes(endDate) || 1;

  return {
    startMinute,
    endMinute: startMinute === endMinute ? endMinute + 30 : endMinute,
  };
};
