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
import weekViewStyles from './WeekTimeInPlaceView.module.scss';
import { DateInfo } from '../Calendar.types';
import { formatFullDate } from '../../../utils/index';
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
  const weekStartsOn = timeDateFormat.weekStartsOn ?? 1;
  // Returns every day of the week
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
      <div data-cy="StringDays" className={weekViewStyles['days-component']}>
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
      <div
        data-cy="WeekTimeInPlaceViewInside"
        className={weekViewStyles['week-time-in-place-view-inside']}
      >
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
        <div className={weekViewStyles['header']}>
          {Array.from(Array(7)).map((_, i) => (
            <>
              <div className={weekViewStyles['cell-header']}>
                <p
                  data-cy="DayNumber"
                  data-day-type={
                    getCurrentWeek[i].isCurrentDay
                      ? 'current'
                      : !getCurrentWeek[i].isCurrentMonth && 'disabled'
                  }
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
        <div data-cy="Cells" className={weekViewStyles['week-row']}>
          {Array.from(Array(24)).map((_, hour) =>
            getCurrentWeek.map((dateInfo, idx) => (
              <div
                className={cn(
                  weekViewStyles['week-row__hour-cell'],
                  hour !== 23 &&
                    weekViewStyles['week-row__hour-cell--border-bottom'],
                )}
                key={dateInfo.date}
              >
                <>
                  <div
                    className={weekViewStyles['week-row__hour-cell--cover']}
                    // onClick={() =>
                    //   onCellClick({
                    //     ...omit(dateInfo, ['isCurrentDay', 'isCurrentMonth']),
                    //     hour,
                    //     cellKey: getKeyFromDateInfo(dateInfo, hour),
                    //   })
                    // }
                  />
                  {idx === 0 && (
                    <div
                      data-cy="Hours"
                      className={
                        weekViewStyles['week-row__hour-cell-hour-number']
                      }
                      // onClick={() =>
                      //   onHourClick({
                      //     ...omit(dateInfo, ['isCurrentDay', 'isCurrentMonth']),
                      //     hour,
                      //   })
                      // }
                    >
                      {getTimeUnitString(hour - 1, timeDateFormat)}
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
