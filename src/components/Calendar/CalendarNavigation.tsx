import React from 'react';
import { formatFullDate } from '@utils/index';
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
    <div className={calendarStyles['calendar__navigation']}>
      <Button arrowSide="left" onClick={() => changeMonth('sub')} />
      <Button arrowSide="right" onClick={() => changeMonth('add')} />

      <div className={calendarStyles['calendar__navigation__month-text']}>
        <span>{format(new Date(currentDate), timeDateFormat.monthYear)}</span>
      </div>
      <Button
        label="Now"
        onClick={() => setCurrentDate(formatFullDate(new Date()))}
      />
    </div>
  );
};

export default DataViewsCalendarHeader;