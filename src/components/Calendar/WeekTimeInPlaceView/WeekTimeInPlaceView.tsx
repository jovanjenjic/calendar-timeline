import React, { useMemo, FC } from 'react';
import cn from 'classnames';
import {
  add,
  getDate,
  getMonth,
  getYear,
  isToday,
  startOfWeek,
  format,
} from 'date-fns';
import { omit } from 'lodash-es';
import weekViewStyles from '@components/Calendar/WeekTimeInPlaceView/WeekTimeInPlaceView.module.scss';
import { DateInfo } from '@base/components/Calendar/Calendar.types';
import { formatFullDate } from '@base/utils/index';
import { getKeyFromDateInfo, getTimeUnitString } from '../Calendar.helper';
import { WeekInPlaceViewProps } from './WeekTimeInPlaceView.types';

const getDateInfo = (date: Date, currentMonth: number): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentMonth: getMonth(date) === currentMonth,
    isCurrentDay: isToday(date),
    date: formatFullDate(date),
  };
};

const WeekTimeInPlaceView: FC<WeekInPlaceViewProps> = ({
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
  const weekStartsOn =
    (timeDateFormat.weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6) ?? 1;

  /**
   * It will contain all the days of the month structured by weeks.
   * The first array is an array of weeks, and each week is an array of days in that week.
   */
  const getCurrentWeek = useMemo(() => {
    const startOfWeekOptions = { weekStartsOn } as const;
    const startDate = startOfWeek(new Date(currentDate), startOfWeekOptions);

    const nextTimeUnit = getDate(add(startDate, { weeks: 1 }));

    const weekDates: DateInfo[] = [];
    let day = 0;

    while (
      getDate(
        startOfWeek(add(startDate, { days: day }), startOfWeekOptions),
      ) !== nextTimeUnit
    ) {
      weekDates.push(
        getDateInfo(
          add(startDate, { days: day }),
          getMonth(new Date(currentDate)),
        ),
      );
      day++;
    }

    return weekDates;
  }, [currentDate, weekStartsOn]);

  return (
    <>
      <div className={weekViewStyles['days-component']}>
        {Array.from(Array(7)).map((_, i) => (
          <>
            <div
              key={i}
              className={weekViewStyles['days-component__day']}
              onClick={() =>
                onDayStringClick(
                  add(startOfWeek(new Date(currentDate), { weekStartsOn }), {
                    days: i,
                  }),
                )
              }
            >
              {format(
                add(startOfWeek(new Date(currentDate), { weekStartsOn }), {
                  days: i,
                }),
                timeDateFormat.day,
              )}
            </div>
          </>
        ))}
      </div>
      <div className={weekViewStyles['week-time-view-inside']}>
        <div className={weekViewStyles['vertical-borders-container']}>
          {Array.from(Array(7)).map((_, key) => (
            <div
              data-cy="CellsBorder"
              key={key}
              className={cn(
                weekViewStyles['vertical-borders-container'],
                weekViewStyles['vertical-borders-container__border'],
              )}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
          }}
        >
          {Array.from(Array(7)).map((_, i) => (
            <>
              <div style={{ margin: '4px auto auto auto' }}>
                <p
                  className={cn(
                    weekViewStyles['cell-header__number'],
                    !getCurrentWeek[i].isCurrentMonth &&
                      weekViewStyles['cell-header__number--disabled'],
                    getCurrentWeek[i].isCurrentDay &&
                      weekViewStyles['cell-header__number--current-day'],
                  )}
                  onClick={() =>
                    onDayNumberClick(new Date(getCurrentWeek[i].date))
                  }
                >
                  {getCurrentWeek[i].day}
                </p>
                {preparedColorDots.dateKeys?.[getCurrentWeek[i].date] && (
                  <p
                    data-cy="ColorDot"
                    data-date={getCurrentWeek[i].date}
                    style={{
                      backgroundColor:
                        preparedColorDots.dateKeys[getCurrentWeek[i].date]
                          ?.color,
                    }}
                    className={weekViewStyles['cell-header__color-dot']}
                    onClick={() =>
                      onColorDotClick(
                        preparedColorDots.dateKeys[getCurrentWeek[i].date],
                      )
                    }
                  />
                )}
              </div>
            </>
          ))}
        </div>
        <div
          style={{ paddingTop: '35px' }}
          className={cn(weekViewStyles['week-row'])}
        >
          {Array.from(Array(24)).map((_, hour) =>
            getCurrentWeek.map((dateInfo, idx) => (
              <div
                className={weekViewStyles['week-row__hour-cell']}
                key={dateInfo.date}
              >
                <>
                  <div
                    className={weekViewStyles['week-row__hour-cell--cover']}
                    onClick={() =>
                      onCellClick({
                        ...omit(dateInfo, ['isCurrentDay', 'isCurrentMonth']),
                        hour,
                        cellKey: getKeyFromDateInfo(dateInfo, hour),
                      })
                    }
                  />
                  {idx === 0 && (
                    <div
                      className={
                        weekViewStyles['week-row__hour-cell-hour-number']
                      }
                      onClick={() =>
                        onHourClick({
                          ...omit(dateInfo, ['isCurrentDay', 'isCurrentMonth']),
                          hour,
                        })
                      }
                    >
                      {getTimeUnitString(hour, timeDateFormat)}
                    </div>
                  )}
                  {renderItems({ dateInfo, hour, idx })}
                </>
              </div>
            )),
          )}
        </div>
      </div>
    </>
  );
};

export default WeekTimeInPlaceView;
