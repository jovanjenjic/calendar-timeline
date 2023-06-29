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
import weekTimeViewStyles from '@components/Calendar/WeekTimeView/WeekTimeView.module.scss';
import { DateInfo } from '@base/components/Calendar/Calendar.types';
import { formatFullDate } from '@base/utils/index';
import { getKeyFromDateInfo, getTimeUnitString } from '../Calendar.helper';
import { WeekTimeViewProps } from './WeekTimeView.types';

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

const WeekTimeView: FC<WeekTimeViewProps> = ({
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
      <div className={weekTimeViewStyles['days-component']}>
        {Array.from(Array(7)).map((_, i) => (
          <>
            <div
              key={i}
              className={weekTimeViewStyles['days-component__day']}
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
      <div className={weekTimeViewStyles['week-time-view-inside']}>
        <div className={weekTimeViewStyles['vertical-borders-container']}>
          {Array.from(Array(7)).map((_, key) => (
            <div
              data-cy="CellsBorder"
              key={key}
              className={cn(
                weekTimeViewStyles['vertical-borders-container'],
                weekTimeViewStyles['vertical-borders-container__border'],
              )}
            />
          ))}
        </div>
        <div className={weekTimeViewStyles['header']}>
          <>
            {Array.from(Array(7)).map((_, i) => (
              <div className={weekTimeViewStyles['header--margin']}>
                <p
                  className={cn(
                    weekTimeViewStyles['header__number'],
                    !getCurrentWeek[i].isCurrentMonth &&
                      weekTimeViewStyles['header__number--disabled'],
                    getCurrentWeek[i].isCurrentDay &&
                      weekTimeViewStyles['header__number--current-day'],
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
                    className={weekTimeViewStyles['header__color-dot']}
                    onClick={() =>
                      onColorDotClick(
                        preparedColorDots.dateKeys[getCurrentWeek[i].date],
                      )
                    }
                  />
                )}
              </div>
            ))}
            {renderHeaderItems(
              getCurrentWeek[0]?.date,
              getCurrentWeek[getCurrentWeek.length - 1]?.date,
            )}
          </>
        </div>
        <div className={weekTimeViewStyles['week']}>
          <>
            <div className={weekTimeViewStyles['week__border-bottom']}>
              {Array.from(Array(24)).map((_, hour) => (
                <div className={weekTimeViewStyles['week__border-bottom-row']}>
                  <p
                    className={
                      weekTimeViewStyles['week__border-bottom-hour-unit']
                    }
                  >
                    {getTimeUnitString(hour, timeDateFormat)}
                  </p>
                </div>
              ))}
            </div>
            {getCurrentWeek.map((dateInfo, idx) => (
              <div className={weekTimeViewStyles['week__column']}>
                <>{renderItems({ dateInfo, idx })}</>
              </div>
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default WeekTimeView;
