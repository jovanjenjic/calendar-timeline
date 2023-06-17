import React from 'react';
import {
  formatFullDate,
  formatMonthAndYear,
  parseFullDate,
} from '@utils/index';
import { add, sub } from 'date-fns';
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
}) => {
  const parsedCurrentDate = parseFullDate(currentDate);

  const changeMonth = (type: 'add' | 'sub'): void => {
    const duration =
      currentView === CurrentView.MONTH ? { months: 1 } : { weeks: 1 };
    const newDate =
      type === 'add'
        ? formatFullDate(add(parsedCurrentDate, duration))
        : formatFullDate(sub(parsedCurrentDate, duration));
    setCurrentDate(newDate);
  };

  return (
    <div className={calendarStyles['data-views__header-calendar']}>
      <Button arrowSide="left" onClick={() => changeMonth('sub')} />
      <Button arrowSide="right" onClick={() => changeMonth('add')} />

      <div
        className={calendarStyles['data-views__header-calendar__month-text']}
      >
        <span data-cy="NavigationDateText">
          {formatMonthAndYear(parsedCurrentDate)}
        </span>
      </div>
      <Button
        label="Now"
        onClick={() => setCurrentDate(formatFullDate(new Date()))}
      />
    </div>
  );
};

export default DataViewsCalendarHeader;
