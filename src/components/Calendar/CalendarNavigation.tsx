import React from 'react';
import { formatFullDate } from '../../utils/index';
import { add, sub, format } from 'date-fns';
import calendarStyles from './Calendar.module.scss';
import Button from '../Button/Button';
import { CalendarHeaderProps, CurrentView } from './Calendar.types';
import { TimeDateFormat } from './Calendar.constants';

const CalendarNavigation: React.FC<CalendarHeaderProps> = ({
  setCurrentDate,
  currentDate,
  currentView,
  timeDateFormat,
}) => {
  const getNextTimeUnit = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.MONTH:
        return 'months';
      case CurrentView.WEEK:
        return 'weeks';
      case CurrentView.WEEK_TIME:
      case CurrentView.WEEK_IN_PLACE:
        return 'weeks';
      case CurrentView.DAY:
      case CurrentView.DAY_IN_PLACE:
        return 'days';
      default:
        return 'months';
    }
  }, [currentView]);

  const changeMonth = (type: 'add' | 'sub'): void => {
    const duration = { [getNextTimeUnit]: 1 };
    const newDate =
      type === 'add'
        ? formatFullDate(add(new Date(currentDate), duration))
        : formatFullDate(sub(new Date(currentDate), duration));
    setCurrentDate(newDate);
  };

  return (
    <div
      data-cy="CalendarNavigation"
      className={calendarStyles['calendar__navigation']}
    >
      <Button
        dataCy="NavigationLeftButton"
        arrowSide="left"
        onClick={() => changeMonth('sub')}
      />
      <Button
        dataCy="NavigationRightButton"
        arrowSide="right"
        onClick={() => changeMonth('add')}
      />

      <div className={calendarStyles['calendar__navigation__month-text']}>
        <span data-cy="NavigationTimeDateText">
          {format(
            new Date(currentDate),
            timeDateFormat?.monthYear || TimeDateFormat.MONTH_YEAR,
          )}
        </span>
      </div>
      <Button
        dataCy="NavigationNowButton"
        label="Now"
        onClick={() => setCurrentDate(formatFullDate(new Date()))}
      />
    </div>
  );
};

export default CalendarNavigation;
