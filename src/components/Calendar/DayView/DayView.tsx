import React, { useMemo, FC } from 'react';
import {
  getDate,
  getMonth,
  getYear,
  isToday,
  format,
  getMinutes,
  getHours,
} from 'date-fns';
import calendarStyles from './DayView.module.scss';
import { getTimeUnitString } from '../Calendar.helper';
import { TimeDateFormat } from '../Calendar.constants';
import { DayTimeViewProps } from './DayView.types';
import { DateInfo } from '../Calendar.types';

const getDateInfo = (date: Date): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentDay: isToday(date),
    date: format(date, TimeDateFormat.FULL_DATE),
  };
};

const DayView: FC<DayTimeViewProps> = ({
  renderItems,
  renderHeaderItems,
  currentView,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  timeDateFormat,
  preparedColorDots,
}) => {
  // Current day info
  const parsedCurrentDay = useMemo(() => {
    return getDateInfo(new Date(currentDate));
  }, [currentDate]);

  return (
    <>
      <div data-cy="StringDay" className={calendarStyles['days-component']}>
        <div
          onClick={() => onDayStringClick(new Date(currentDate))}
          className={calendarStyles['days-component__day']}
        >
          {format(
            new Date(currentDate),
            timeDateFormat.day || TimeDateFormat.SHORT_WEEKDAY,
          )}
        </div>
      </div>
      <div
        data-cy="DayViewInside"
        className={calendarStyles['day-view-inside']}
      >
        <div className={calendarStyles['header']}>
          <div className={calendarStyles['header__number-color-dot']}>
            <p
              data-cy="DayNumber"
              className={`
                ${calendarStyles['header__number']}
                ${
                  parsedCurrentDay.isCurrentDay &&
                  calendarStyles['header__number--current-day']
                }
              `}
              onClick={() => onDayNumberClick(new Date(parsedCurrentDay.date))}
            >
              {parsedCurrentDay.day}
            </p>
            {preparedColorDots.dateKeys?.[parsedCurrentDay.date] && (
              <p
                data-cy="ColorDot"
                data-date={parsedCurrentDay.date}
                style={{
                  backgroundColor:
                    preparedColorDots.dateKeys[parsedCurrentDay.date]?.color,
                }}
                className={calendarStyles['header__color-dot']}
                onClick={() =>
                  onColorDotClick(
                    preparedColorDots.dateKeys[parsedCurrentDay.date],
                  )
                }
              />
            )}
          </div>
          {renderHeaderItems(parsedCurrentDay?.date)}
        </div>
        <div className={calendarStyles['hour-rows']}>
          <>
            <div
              data-cy="HourRows"
              className={calendarStyles['hour-rows__border-bottom']}
            >
              {Array.from(Array(24)).map((_, hour) => (
                <div
                  data-cy="Hours"
                  className={calendarStyles['hour-rows__border-bottom-line']}
                >
                  <p
                    className={
                      calendarStyles['hour-rows__border-bottom-hour-unit']
                    }
                  >
                    {getTimeUnitString(hour - 1, timeDateFormat)}
                  </p>
                </div>
              ))}
            </div>
            <div className={calendarStyles['hour-rows__items']}>
              {renderItems({ dateInfo: parsedCurrentDay, idx: 0 })}
              {parsedCurrentDay.isCurrentDay && (
                <div
                  data-cy="CurrentMinutLine"
                  className={calendarStyles['current-minute-line']}
                  style={{
                    gridColumn: '1/3',
                    gridRow: getHours(new Date()) * 60 + getMinutes(new Date()),
                  }}
                />
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default DayView;
