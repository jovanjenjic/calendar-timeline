import React from 'react';
import { formatFullDate, parseFullDate } from '@utils/index';
import { add, sub, format } from 'date-fns';
import calendarStyles from '@components/Calendar/Calendar.module.scss';
import Button from '@base/components/Button/Button';
import {
  CalendarHeaderProps,
  CurrentView,
} from '@base/components/Calendar/Calendar.types';

const DataViewsCalendarHeader: React.FC<CalendarHeaderProps> = ({
  setCurrentDate,
  currentDate,
  currentView,
  timeDateFormat,
}) => {
  const parsedCurrentDate = parseFullDate(currentDate);

  const getNextTimeUnit = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.MONTH:
        return 'months';
      case CurrentView.WEEK:
        return 'weeks';
      case CurrentView.WEEK_TIME:
        return 'weeks';
      case CurrentView.DAY:
        return 'days';
      default:
        return 'months';
    }
  }, [currentView]);

  const changeMonth = (type: 'add' | 'sub'): void => {
    const duration = { [getNextTimeUnit]: 1 };
    const newDate =
      type === 'add'
        ? formatFullDate(add(parsedCurrentDate, duration))
        : formatFullDate(sub(parsedCurrentDate, duration));
    setCurrentDate(newDate);
  };

  return (
    <div className={calendarStyles['calendar__navigation']}>
      <Button arrowSide="left" onClick={() => changeMonth('sub')} />
      <Button arrowSide="right" onClick={() => changeMonth('add')} />

      <div className={calendarStyles['calendar__navigation__month-text']}>
        <span>{format(parsedCurrentDate, timeDateFormat.monthYear)}</span>
      </div>
      <Button
        label="Now"
        onClick={() => setCurrentDate(formatFullDate(new Date()))}
      />
    </div>
  );
};

export default DataViewsCalendarHeader;
