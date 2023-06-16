import React from 'react';

import calendarStyles from '@components/Calendar/Calendar.module.scss';
import Calendar from '@base/components/Calendar/Calendar';
import {
  CalendarViewProps,
  DateInfoFunction,
} from '@base/components/Calendar/Calendar.types';
import { prepareCalendarData } from '@base/utils/index';

const CalendarView: React.FC<CalendarViewProps> = ({
  data,
  currentDate,
  setCurrentDate,
  activeTimeDateField,
  currentView,
  colorDots,
}) => {
  // Prepared data so that for each item in the array there is all the data as well as the length of the interval
  const preparedData = React.useMemo(
    () => prepareCalendarData(data, activeTimeDateField),
    [data, activeTimeDateField],
  );

  // Based on the prepared data, it is iterated through each day of the week and all elements in
  // that data are placed at the appropriate position and length within grid container.
  const renderItems = ({ dateInfo, idx }: DateInfoFunction) => {
    return (preparedData[dateInfo.date] || []).map((value, index) => (
      <div
        data-cy="CalendarInfoCard"
        data-card-date={dateInfo.date}
        key={`${index}-${dateInfo.date}`}
        className={calendarStyles['cells-component-row__item']}
        style={{
          gridColumn: `${idx + 1} / ${idx + value?.length + 1}`,
        }}
      >
        {value.id}
      </div>
    ));
  };

  return (
    <Calendar
      showNavigation={true}
      renderItems={renderItems}
      setCurrentDate={setCurrentDate}
      currentView={currentView}
      colorDots={colorDots}
      currentDate={currentDate}
    />
  );
};

export default CalendarView;
