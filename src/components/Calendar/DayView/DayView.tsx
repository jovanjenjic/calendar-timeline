import React, { useMemo, FC } from 'react';
import cn from 'classnames';
import {
  getDate,
  getMonth,
  getYear,
  isToday,
  format,
  getMinutes,
  getHours,
} from 'date-fns';
import { omit } from 'lodash-es';
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
  /**
   * It will contain all the days of the month structured by weeks.
   * The first array is an array of weeks, and each week is an array of days in that week.
   */
  const parsedCurrentDay = useMemo(() => {
    return getDateInfo(new Date(currentDate));
  }, [currentDate]);

  return (
    <>
      <div className={calendarStyles['days-component']}>
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
      <div className={calendarStyles['day-view-inside']}>
        <div className={calendarStyles['header']}>
          <div className={calendarStyles['header__number-color-dot']}>
            <p
              className={cn(
                calendarStyles['header__number'],
                parsedCurrentDay.isCurrentDay &&
                  calendarStyles['header__number--current-day'],
              )}
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
            <div className={calendarStyles['hour-rows__border-bottom']}>
              {Array.from(Array(24)).map((_, hour) => (
                <div
                  className={calendarStyles['hour-rows__border-bottom-line']}
                >
                  <p
                    className={
                      calendarStyles['hour-rows__border-bottom-hour-unit']
                    }
                  >
                    {getTimeUnitString(hour, timeDateFormat)}
                  </p>
                </div>
              ))}
            </div>
            <div className={calendarStyles['hour-rows__items']}>
              {renderItems({ dateInfo: parsedCurrentDay, idx: 0 })}
              {parsedCurrentDay.isCurrentDay && (
                <div
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
