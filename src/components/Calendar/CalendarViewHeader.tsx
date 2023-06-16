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
      <Button
        attributes={{
          className: calendarStyles['data-views__header-calendar__button'],
          'data-cy': 'NavigationLeftArrow',
        }}
        variation="secondary"
        size="small"
        label=""
        iconName="simpleArrowLeft"
        iconColoringMode="stroke"
        iconSize={{ width: 9 }}
        onClick={() => changeMonth('sub')}
      />
      <Button
        attributes={{
          className: calendarStyles['data-views__header-calendar__button'],
          'data-cy': 'NavigationRightArrow',
        }}
        variation="secondary"
        size="small"
        label=""
        iconName="simpleArrowRight"
        iconColoringMode="stroke"
        iconSize={{ width: 9 }}
        onClick={() => changeMonth('add')}
      />
      <div
        className={calendarStyles['data-views__header-calendar__month-text']}
      >
        <span data-cy="NavigationDateText">
          {formatMonthAndYear(parsedCurrentDate)}
        </span>
      </div>
      <Button
        attributes={{
          className: calendarStyles['data-views__header-calendar__button'],
          'data-cy': 'NavigationTodayButton',
        }}
        variation="secondary"
        size="small"
        label="Today"
        onClick={() => setCurrentDate(formatFullDate(new Date()))}
      />
    </div>
  );
};

export default DataViewsCalendarHeader;
