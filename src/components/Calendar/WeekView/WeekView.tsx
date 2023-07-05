import React, { useMemo, FC } from 'react';
import {
  add,
  getDate,
  getMonth,
  getYear,
  isToday,
  startOfWeek,
  format,
} from 'date-fns';
import weekViewStyles from './WeekVIew.module.scss';
import { DateInfo } from '../Calendar.types';
import { formatFullDate } from '../../../utils/index';
import { WeekViewProps } from './WeekView.types';

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

const WeekView: FC<WeekViewProps> = ({
  renderItems,
  currentView,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onColorDotClick,
  onCellClick,
  timeDateFormat,
  preparedColorDots,
}) => {
  const weekStartsOn = timeDateFormat.weekStartsOn ?? 1;

  /**
   * It will contain all the days of the month structured by weeks.
   * The first array is an array of weeks, and each week is an array of days in that week.
   */
  const getCurrentWeek = useMemo(() => {
    const startDate = startOfWeek(new Date(currentDate), { weekStartsOn });

    const nextTimeUnit = getDate(add(startDate, { weeks: 1 }));

    const weekDates: DateInfo[] = [];
    let day = 0;

    while (
      getDate(startOfWeek(add(startDate, { days: day }), { weekStartsOn })) !==
      nextTimeUnit
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
        ))}
      </div>
      <div
        data-cy="WeekViewInside"
        className={weekViewStyles['week-view-inside']}
      >
        <div
          data-cy="VerticalBorders"
          className={weekViewStyles['vertical-borders-container']}
        >
          {Array.from(Array(7)).map((_, key) => (
            <div
              key={key}
              className={`
                ${weekViewStyles['vertical-borders-container']}
                ${weekViewStyles['vertical-borders-container__border']}
              `}
            />
          ))}
        </div>
        <div data-cy="WeekRow" className={weekViewStyles['week-row']}>
          {getCurrentWeek.map((dateInfo, idx) => (
            <React.Fragment key={dateInfo.date}>
              <div
                className={weekViewStyles['week-row-day-cell--cover']}
                style={{
                  gridColumn: `${idx + 1} / ${idx + 2}`,
                }}
                // onClick={() =>
                //   onCellClick({
                //     ...omit(dateInfo, ['isCurrentDay', 'isCurrentMonth']),
                //     hour: 0,
                //     cellKey: formatFullDate(new Date(dateInfo.date)),
                //   })
                // }
              />
              <div className={weekViewStyles['cell-header']}>
                <p
                  data-cy="DayNumber"
                  data-day-type={
                    dateInfo.isCurrentDay
                      ? 'current'
                      : !dateInfo.isCurrentMonth && 'disabled'
                  }
                  className={`
                    ${weekViewStyles['cell-header__number']}
                    ${
                      !dateInfo.isCurrentMonth &&
                      weekViewStyles['cell-header__number--disabled']
                    }
                    ${
                      dateInfo.isCurrentDay &&
                      weekViewStyles['cell-header__number--current-day']
                    }
                  `}
                  onClick={() => onDayNumberClick(new Date(dateInfo.date))}
                >
                  {dateInfo.day}
                </p>
                {preparedColorDots.dateKeys?.[dateInfo.date] && (
                  <p
                    data-cy="ColorDot"
                    data-date={dateInfo.date}
                    style={{
                      backgroundColor:
                        preparedColorDots.dateKeys[dateInfo.date]?.color,
                    }}
                    className={weekViewStyles['cell-header__color-dot']}
                    onClick={() =>
                      onColorDotClick(preparedColorDots.dateKeys[dateInfo.date])
                    }
                  />
                )}
              </div>
              {renderItems({ dateInfo, idx })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeekView;
