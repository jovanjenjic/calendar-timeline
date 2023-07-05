import React, { useMemo, FC, useState, useLayoutEffect, useRef } from 'react';
import {
  add,
  getDate,
  getMonth,
  getYear,
  isToday,
  startOfWeek,
  format,
  startOfMonth,
} from 'date-fns';
import monthViewStyles from './MonthView.module.scss';
import { DateInfo } from '../Calendar.types';
import { formatFullDate, isEqualValues, omit } from '../../../utils/index';
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
  const weekStartsOn = timeDateFormat.weekStartsOn ?? 1;

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
            if (!isEqualValues(newArray, visibleWeeks)) {
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

  // It will contain all the days of the month structured by weeks.
  // The first array is an array of weeks, and each week is an array of days in that week.
  const getAllWeeksInMonth = useMemo(() => {
    const startDate = startOfWeek(startOfMonth(new Date(currentDate)), {
      weekStartsOn,
    });
    const nextMonth = getMonth(add(new Date(currentDate), { months: 1 }));

    const allDates: DateInfo[][] = [];
    let weekDates: DateInfo[] = [];
    let day = 0;

    while (
      getMonth(startOfWeek(add(startDate, { days: day }), { weekStartsOn })) !==
      nextMonth
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
      <div data-cy="StringDays" className={monthViewStyles['days-component']}>
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
      <div
        data-cy="MonthViewInside"
        className={monthViewStyles['month-view-inside']}
      >
        <div
          data-cy="VerticalBorders"
          className={monthViewStyles['vertical-borders-container']}
        >
          {Array.from(Array(7)).map((_, key) => (
            <div
              key={key}
              className={`
                ${monthViewStyles['vertical-borders-container']}
                ${monthViewStyles['vertical-borders-container__border']}
              `}
            />
          ))}
        </div>

        {getAllWeeksInMonth.map((week, index) => {
          return (
            <div
              key={`${week[0].date}/${index}`}
              className={monthViewStyles['week-row']}
              ref={(el) => (weekRefs.current[index] = el!)}
              data-week-index={index}
              data-cy="WeekRow"
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
                        cellKey: formatFullDate(new Date(dateInfo.date)),
                      })
                    }
                  />
                  <div className={monthViewStyles['cell-header']}>
                    <p
                      data-cy="DayNumber"
                      data-day-type={
                        dateInfo.isCurrentDay
                          ? 'current'
                          : !dateInfo.isCurrentMonth && 'disabled'
                      }
                      className={`
                        ${monthViewStyles['cell-header__number']}
                        ${
                          !dateInfo.isCurrentMonth &&
                          monthViewStyles['cell-header__number--disabled']
                        }
                        ${
                          dateInfo.isCurrentDay &&
                          monthViewStyles['cell-header__number--current-day']
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
