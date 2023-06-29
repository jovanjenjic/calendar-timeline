import React, { useMemo, FC, useState, useLayoutEffect, useRef } from 'react';
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
import { isEqual, omit } from 'lodash-es';
import monthViewStyles from '@components/Calendar/MonthView/MonthView.module.scss';
import { DateInfo } from '@base/components/Calendar/Calendar.types';
import { formatFullDate } from '@base/utils/index';
import { getKeyFromDateInfo } from '../Calendar.helper';
import { MonthViewProps } from './MonthVIew.types';

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

const MonthView: FC<MonthViewProps> = ({
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
  // It is necessary to render the rows (weeks) that are visible in the viewport
  const [visibleWeeks, setVisibleWeeks] = useState<number[]>([0]);
  const weekRefs = useRef<HTMLDivElement[]>([]);
  const weekStartsOn =
    (timeDateFormat.weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6) ?? 1;

  useLayoutEffect(() => {
    setVisibleWeeks([0]);
  }, [currentView, currentDate]);

  useLayoutEffect(() => {
    // Observer that keeps track of which rows are visible
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const newArray = [...visibleWeeks];
        let isStateUpdated = false;
        entries.forEach((entry) => {
          const entryTarget = entry.target as HTMLDivElement;
          const weekIndex = +(entryTarget.dataset.weekIndex || 0);
          if (
            !isStateUpdated &&
            entry.isIntersecting &&
            !newArray.includes(weekIndex)
          ) {
            newArray.push(weekIndex);
            if (!isEqual(newArray, visibleWeeks)) {
              setVisibleWeeks(newArray);
            }
            isStateUpdated = true;
          }
        });
      },
    );

    if (weekRefs && weekRefs.current) {
      weekRefs.current.forEach((weekRef) => {
        if (weekRef instanceof HTMLDivElement) {
          observer.observe(weekRef);
        }
      });
    }

    return () => observer.disconnect();
  }, [visibleWeeks]);

  /**
   * It will contain all the days of the month structured by weeks.
   * The first array is an array of weeks, and each week is an array of days in that week.
   */
  const getAllWeeksInMonth = useMemo(() => {
    const startOfWeekOptions = { weekStartsOn } as const;

    const startDate = startOfWeek(new Date(currentDate), startOfWeekOptions);
    const nextMonth = getMonth(add(new Date(currentDate), { months: 1 }));

    const allDates: DateInfo[][] = [];
    let weekDates: DateInfo[] = [];
    let day = 0;

    while (
      getMonth(
        startOfWeek(add(startDate, { days: day }), startOfWeekOptions),
      ) !== nextMonth
    ) {
      weekDates.push(
        getDateInfo(
          add(startDate, { days: day }),
          getMonth(new Date(currentDate)),
        ),
      );

      if (++day % 7 === 0) {
        allDates.push(weekDates);
        weekDates = [];
      }
    }

    return allDates;
  }, [currentDate, currentView, weekStartsOn]);

  return (
    <>
      <div className={monthViewStyles['days-component']}>
        {Array.from(Array(7)).map((_, i) => (
          <div
            key={i}
            className={monthViewStyles['days-component__day']}
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
      <div className={monthViewStyles['month-view-inside']}>
        <div className={monthViewStyles['vertical-borders-container']}>
          {Array.from(Array(7)).map((_, key) => (
            <div
              key={key}
              className={cn(
                monthViewStyles['vertical-borders-container'],
                monthViewStyles['vertical-borders-container__border'],
              )}
            />
          ))}
        </div>

        {getAllWeeksInMonth.map((week, index) => {
          return (
            <div
              key={`${week[0].date}/${index}`}
              className={cn(monthViewStyles['week-row'])}
              ref={(el) => (weekRefs.current[index] = el!)}
              data-week-index={index}
            >
              {week.map((dateInfo, idx) => (
                <React.Fragment key={dateInfo.date}>
                  <div
                    className={monthViewStyles['week-row__day-cell--cover']}
                    style={{
                      gridColumn: `${idx + 1} / ${idx + 2}`,
                    }}
                    onClick={() =>
                      onCellClick({
                        ...omit(dateInfo, ['isCurrentDay', 'isCurrentMonth']),
                        hour: 0,
                        cellKey: getKeyFromDateInfo(dateInfo),
                      })
                    }
                  />
                  <div className={monthViewStyles['cell-header']}>
                    <p
                      className={cn(
                        monthViewStyles['cell-header__number'],
                        !dateInfo.isCurrentMonth &&
                          monthViewStyles['cell-header__number--disabled'],
                        dateInfo.isCurrentDay &&
                          monthViewStyles['cell-header__number--current-day'],
                      )}
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
                        className={monthViewStyles['cell-header__color-dot']}
                        onClick={() =>
                          onColorDotClick(
                            preparedColorDots.dateKeys[dateInfo.date],
                          )
                        }
                      />
                    )}
                  </div>
                  {visibleWeeks.includes(index) &&
                    renderItems({ dateInfo, idx })}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MonthView;
