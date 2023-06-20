import React, {
  useMemo,
  FC,
  useState,
  useLayoutEffect,
  useRef,
  ReactElement,
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
import {
  addTimeUnit,
  getNextTimeUnit,
  getTimeUnitString,
} from './Calendar.helper';

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
   * The first array is an array of weeks, and each week is an array of days in that week.
   */
  const getAllWeeksInMonthBasedOnView = useMemo(() => {
    const startOfWeekOptions = { weekStartsOn } as const;
    const parsedCurrentDate = parseFullDate(currentDate);
    const forParsing =
      currentView === CurrentView.MONTH
        ? startOfMonth(parsedCurrentDate)
        : parsedCurrentDate;
    const startDate =
      currentView === CurrentView.DAY
        ? forParsing
        : startOfWeek(forParsing, startOfWeekOptions);
    const nextTimeUnit = getNextTimeUnit(
      currentView,
      currentView === CurrentView.MONTH ? parsedCurrentDate : startDate,
    );
    const allDates: DateInfo[][] = [];
    let weekDates: DateInfo[] = [];
    let day = 0;

    while (
      addTimeUnit(currentView, startDate, day, startOfWeekOptions) !==
      nextTimeUnit
    ) {
      weekDates.push(
        getDateInfo(add(startDate, { days: day }), getMonth(parsedCurrentDate)),
      );

      if (++day % 7 === 0 || currentView === CurrentView.DAY) {
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

  const renderDays = React.useMemo((): ReactElement => {
    const renderContent = () => {
      switch (currentView) {
        case CurrentView.DAY:
          return (
            <div className={calendarStyles['calendar-days-component__day']}>
              {formatShortWeekday(new Date(currentDate))}
            </div>
          );
        case CurrentView.WEEK_HOURS:
        case CurrentView.WEEK:
        case CurrentView.MONTH:
          return (
            <>
              {Array.from(Array(7)).map((_, i) => (
                <div
                  key={i}
                  className={calendarStyles['calendar-days-component__day']}
                >
                  {formatShortWeekday(
                    add(startOfWeek(new Date(), { weekStartsOn }), {
                      days: i,
                    }),
                  )}
                </div>
              ))}
            </>
          );
      }
    };
    return (
      <div className={calendarStyles['calendar-days-component']}>
        {renderContent()}
      </div>
    );
  }, [currentDate, currentView]);

  const renderRowHeader = React.useCallback(
    (dateInfo): ReactElement => (
      <div className={calendarStyles['calendar-item-header']}>
        <p
          className={cn(
            calendarStyles['calendar-item-header__number'],
            !dateInfo.isCurrentMonth &&
              calendarStyles['calendar-item-header__number--disabled'],
            dateInfo.isCurrentDay &&
              calendarStyles['calendar-item-header__number--current-day'],
          )}
        >
          {dateInfo.day}
        </p>
        {preparedColorDots.dateKeys?.[dateInfo.date] && (
          <p
            data-cy="ColorDot"
            data-date={dateInfo.date}
            style={{
              backgroundColor: preparedColorDots.dateKeys[dateInfo.date]?.color,
            }}
            className={calendarStyles['calendar-item-header__color-dot']}
          />
        )}
      </div>
    ),
    [],
  );

  const renderWeekOrHour = (dateInfo, hour, idx, index) => {
    const isWeekHoursOrDay =
      currentView === CurrentView.WEEK_HOURS || currentView === CurrentView.DAY;

    const HtmlElement = isWeekHoursOrDay ? 'div' : React.Fragment;

    const renderHourElement = idx === 0 && isWeekHoursOrDay && (
      <div
        className={
          calendarStyles['calendar-week-or-hour-row__horizontal-border-hour']
        }
      >
        {getTimeUnitString(hour - 1)}
      </div>
    );

    return (
      <HtmlElement
        className={
          calendarStyles['calendar-week-or-hour-row__horizontal-border']
        }
        key={dateInfo.date}
      >
        {renderHourElement}
        {hour === 0 && renderRowHeader(dateInfo)}
        {visibleWeeks.includes(index) && renderItems({ dateInfo, hour, idx })}
      </HtmlElement>
    );
  };

  const renderWeeksOrDay = (week, index) => {
    const renderContent = () => {
      switch (currentView) {
        case CurrentView.DAY:
          return Array.from(Array(24)).map((_, hour) =>
            renderWeekOrHour(week[0], hour, 0, 0),
          );
        case CurrentView.WEEK_HOURS:
          return Array.from(Array(24)).map((_, hour) =>
            week.map((dateInfo, idx) =>
              renderWeekOrHour(dateInfo, hour, idx, index),
            ),
          );
        case CurrentView.MONTH:
        case CurrentView.WEEK:
          return week.map((dateInfo, idx) =>
            renderWeekOrHour(dateInfo, 0, idx, index),
          );
        default:
          return null;
      }
    };

    return (
      <div
        key={`${week[0].date}/${index}`}
        className={cn(
          calendarStyles['calendar-week-or-hour-row'],
          calendarStyles[`calendar-week-or-hour-row__${currentView}`],
        )}
        ref={(el) => (weekRefs.current[index] = el!)}
        data-week-index={index}
      >
        {renderContent()}
      </div>
    );
  };

  return (
    <>
      {showNavigation && !!setCurrentDate && (
        <DataViewsCalendarHeader
          currentDate={currentDate}
          currentView={currentView}
          setCurrentDate={setCurrentDate}
        />
      )}
      <div className={calendarStyles['calendar']}>
        {renderDays}
        <div className={calendarStyles['calendar__inside']}>
          {currentView !== CurrentView.DAY && (
            <div className={calendarStyles['vertical-borders-container']}>
              {Array.from(Array(7)).map((_, key) => (
                <div
                  data-cy="CellsBorder"
                  key={key}
                  className={cn(
                    calendarStyles['vertical-borders-container'],
                    calendarStyles['vertical-borders-container__border'],
                  )}
                />
              ))}
            </div>
          )}
          {getAllWeeksInMonthBasedOnView.map(renderWeeksOrDay)}
        </div>
        {!isEmpty(preparedColorDots) && (
          <div className={calendarStyles['calendar-color-dots-legend']}>
            {Object.keys(preparedColorDots.colorKeys).map((color) => (
              <div
                key={color}
                className={calendarStyles['calendar-color-dots-legend__flex']}
              >
                <p
                  style={{ background: color }}
                  className={
                    calendarStyles[
                      'calendar-color-dots-legend__flex__color-dot'
                    ]
                  }
                />
                <p
                  className={
                    calendarStyles['calendar-color-dots-legend__flex__text']
                  }
                >
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
