import React, { useMemo, FC } from 'react';
import cn from 'classnames';
import { getDate, getMonth, getYear, isToday, format } from 'date-fns';
import calendarStyles from './DayInPlaceView.module.scss';
import { getKeyFromDateInfo, getTimeUnitString } from '../Calendar.helper';
import { TimeDateFormat } from '../Calendar.constants';
import { DateInfo } from '../Calendar.types';
import { DayInPlaceViewProps } from './DayInPlaceView.types';
import { omit } from '../../../utils';

const getDateInfo = (date: Date, currentMonth: number): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentMonth: getMonth(date) === currentMonth,
    isCurrentDay: isToday(date),
    date: format(date, TimeDateFormat.FULL_DATE),
  };
};

const DayInPlaceView: FC<DayInPlaceViewProps> = ({
  renderItems,
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
    return getDateInfo(new Date(currentDate), getMonth(new Date(currentDate)));
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
        data-cy="DayInPlaceViewInside"
        className={calendarStyles['day-view-inside']}
      >
        <div className={calendarStyles['cell-header']}>
          <p
            data-cy="DayNumber"
            className={cn(
              calendarStyles['cell-header__number'],
              !parsedCurrentDay.isCurrentMonth &&
                calendarStyles['cell-header__number--disabled'],
              parsedCurrentDay.isCurrentDay &&
                calendarStyles['cell-header__number--current-day'],
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
              className={calendarStyles['cell-header__color-dot']}
              onClick={() =>
                onColorDotClick(
                  preparedColorDots.dateKeys[parsedCurrentDay.date],
                )
              }
            />
          )}
        </div>
        <div
          data-cy="Cells"
          key={parsedCurrentDay.date}
          className={cn(calendarStyles['hour-row'])}
        >
          {Array.from(Array(24)).map((_, hour) => (
            <div
              className={calendarStyles['hour-row__hour-cell']}
              key={parsedCurrentDay.date}
            >
              <>
                <div
                  className={calendarStyles['hour-row__hour-cell--cover']}
                  // onClick={() =>
                  //   onCellClick({
                  //     ...omit(parsedCurrentDay, [
                  //       'isCurrentDay',
                  //       'isCurrentMonth',
                  //     ]),
                  //     hour,
                  //     cellKey: getKeyFromDateInfo(parsedCurrentDay, hour),
                  //   })
                  // }
                />
                <div
                  data-cy="Hours"
                  className={calendarStyles['hour-row__hour-cell-hour-number']}
                  // onClick={() =>
                  //   onHourClick({
                  //     ...omit(parsedCurrentDay, [
                  //       'isCurrentDay',
                  //       'isCurrentMonth',
                  //     ]),
                  //     hour,
                  //   })
                  // }
                >
                  {getTimeUnitString(hour, timeDateFormat)}
                </div>
                {renderItems({ dateInfo: parsedCurrentDay, hour, idx: 0 })}
              </>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DayInPlaceView;
