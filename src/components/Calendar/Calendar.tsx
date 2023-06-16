import React, {
  useMemo,
  FC,
  useState,
  useLayoutEffect,
  useRef,
  Fragment,
} from 'react';
import cn from 'classnames';
import {
  add,
  getDate,
  getMonth,
  getYear,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { isEmpty, isEqual } from 'lodash';
import calendarStyles from '@components/Calendar/Calendar.module.scss';
import {
  CalendarProps,
  CurrentView,
  DateInfo,
} from '@base/components/Calendar/Calendar.types';
import {
  parseFullDate,
  formatFullDate,
  formatShortWeekday,
} from '@base/utils/index';
import DataViewsCalendarHeader from './CalendarViewHeader';

const getDateInfo = (date: Date, currentMonth: number): any => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentMonth: getMonth(date) === currentMonth,
    isCurrentDay: isToday(date),
    date: formatFullDate(date),
  };
};

const Calendar: FC<CalendarProps> = ({
  renderItems,
  currentView,
  currentDate,
  colorDots,
  showNavigation,
  setCurrentDate,
}) => {
  // It is necessary to render the rows (weeks) that are visible in the viewport
  const [visibleWeeks, setVisibleWeeks] = useState<number[]>([0]);
  const weekRefs = useRef<HTMLDivElement[]>([]);
  const weekStartsOn = 1;

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
   * The first array is a array of weeks and each week is a array of days in that week
   */
  const getAllWeeksInMonth = useMemo(() => {
    const startOfWeekOptions = { weekStartsOn } as const;
    const isMonthView = currentView === CurrentView.MONTH;
    const parsedCurrentDate = parseFullDate(currentDate);
    const forParsing = isMonthView
      ? startOfMonth(parsedCurrentDate)
      : parsedCurrentDate;
    // The first day of the current week or month in the calendar table
    const startDate = startOfWeek(forParsing, startOfWeekOptions);

    // If `isMonthView` then it is the next month, else it is the first day in next week
    const nextTimeUnit: number = isMonthView
      ? getMonth(add(parsedCurrentDate, { months: 1 }))
      : getDate(add(startDate, { weeks: 1 }));

    // All the weeks (together with all the days in week) in one month
    const allDates: DateInfo[][] = [];
    // All days in one week
    let weekDates: DateInfo[] = [];

    let day = 0;

    // It will iterate until it encounters the first day of the next week or month (dependent on `currentView`)
    while (
      (isMonthView
        ? getMonth(
            startOfWeek(add(startDate, { days: day }), startOfWeekOptions),
          )
        : getDate(
            startOfWeek(add(startDate, { days: day }), startOfWeekOptions),
          )) !== nextTimeUnit
    ) {
      const formatted = getDateInfo(
        add(startDate, { days: day }),
        getMonth(parsedCurrentDate),
      );
      weekDates.push(formatted);

      // When it comes to the end of the week, it puts the whole week into a month, and restarts the data to move on to the next week
      if (++day % 7 === 0) {
        allDates.push(weekDates);
        weekDates = [];
      }
    }

    return allDates;
  }, [currentDate, currentView, weekStartsOn]);

  // Object that will be used to display the color dot for each day, but also for the legend below the calendar
  const preparedColorDots = useMemo(() => {
    const newValue = { dateKeys: {}, colorKeys: {} };
    (colorDots || []).forEach((dot) => {
      newValue.dateKeys[dot.date] = dot;
      newValue.colorKeys[dot.color] = dot;
    });
    return newValue;
  }, [colorDots]);

  return (
    <>
      {showNavigation && setCurrentDate && (
        <DataViewsCalendarHeader
          currentDate={currentDate}
          currentView={currentView}
          setCurrentDate={setCurrentDate}
        />
      )}
      <div className={calendarStyles['calendar-wrapper']}>
        <div className={calendarStyles['days-component']} data-cy="WeekDays">
          {Array.from(Array(7)).map((_, i) => (
            <div key={i} className={calendarStyles['days-component__day']}>
              {formatShortWeekday(
                add(startOfWeek(new Date(), { weekStartsOn }), { days: i }),
              )}
            </div>
          ))}
        </div>
        <div className={calendarStyles['cells-component']}>
          <div className={calendarStyles['border-container']}>
            {Array.from(Array(7)).map((_, key) => (
              <div
                data-cy="CellsBorder"
                key={key}
                className={cn(
                  calendarStyles['border-container'],
                  calendarStyles['border-container__border'],
                )}
              />
            ))}
          </div>
          {getAllWeeksInMonth.map((week: DateInfo[], index: number) => (
            // One row is one week and there are seven columns for each day of the week. The entire row is one grid container in which elements are implicitly placed
            <div
              key={`${week[0].date}/${week[1].date}`}
              className={calendarStyles['cells-component-row']}
              ref={(el) => (weekRefs.current[index] = el!)}
              data-week-index={index}
              data-cy="WeekRow"
            >
              {week.map((dateInfo: DateInfo, idx: number) => (
                <Fragment key={dateInfo.date}>
                  <div
                    className={calendarStyles['cells-component-row__header']}
                  >
                    <p
                      data-cy="DayNumber"
                      data-day-type={
                        dateInfo.isCurrentDay
                          ? 'current'
                          : !dateInfo.isCurrentMonth && 'disabled'
                      }
                      className={cn(
                        calendarStyles['cells-component-row__header__number'],
                        !dateInfo.isCurrentMonth &&
                          calendarStyles[
                            'cells-component-row__header__number--disabled'
                          ],
                        dateInfo.isCurrentDay &&
                          calendarStyles[
                            'cells-component-row__header__number--current-day'
                          ],
                      )}
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
                        className={
                          calendarStyles[
                            'cells-component-row__header__color-dot'
                          ]
                        }
                      />
                    )}
                  </div>
                  {visibleWeeks.includes(index) &&
                    renderItems({ dateInfo, idx })}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
        {!isEmpty(preparedColorDots) && (
          <div className={calendarStyles['color-dots-legend-wrapper']}>
            {Object.keys(preparedColorDots.colorKeys).map((color) => (
              <div key={color} className={calendarStyles['color-dots-legend']}>
                <p
                  style={{ background: color }}
                  className={calendarStyles['color-dots-legend__color-dot']}
                />
                <p className={calendarStyles['color-dots-legend__text']}>
                  {preparedColorDots?.colorKeys[color]?.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;
