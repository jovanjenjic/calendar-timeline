import React from 'react';
import { add } from 'date-fns';
import calendarStyles from '@components/Calendar/Calendar.module.scss';
import Calendar from '@base/components/Calendar/Calendar';
import {
  CalendarViewProps,
  CurrentView,
  DateInfo,
  DateInfoFunction,
} from '@base/components/Calendar/Calendar.types';
import {
  formatFullDateTime,
  prepareCalendarData,
  prepareCalendarDataWeekHours,
} from '@base/utils/index';

const CalendarView: React.FC<CalendarViewProps> = ({
  data,
  currentDate,
  setCurrentDate,
  activeTimeDateField,
  currentView,
  onlyOneOnPlace,
  colorDots,
}) => {
  // Prepared data so that for each item in the array there is all the data as well as the length of the interval
  const preparedData = React.useMemo(
    () =>
      currentView === CurrentView.WEEK_HOURS || currentView === CurrentView.DAY
        ? prepareCalendarDataWeekHours(data, activeTimeDateField)
        : prepareCalendarData(data, activeTimeDateField),
    [data, activeTimeDateField, currentView],
  );

  // In case it is WEEK_HOURS or DAY view, it is needed to add the hours in order to keep track of the hours as well
  const getKeyFromDateInfo = (dateInfo: DateInfo, hour: number): string => {
    let key: string = dateInfo.date;

    if (
      currentView === CurrentView.WEEK_HOURS ||
      currentView === CurrentView.DAY
    ) {
      const currentHour: Date = add(new Date(`${dateInfo.date} 00:00:00`), {
        hours: hour,
      });
      key = formatFullDateTime(currentHour);
    }

    return key;
  };

  // Based on the prepared data, it is iterated through each day of the week and all elements in
  // that data are placed at the appropriate position and length within grid container.
  const renderItems = ({ dateInfo, idx, hour }: DateInfoFunction) => {
    const key = getKeyFromDateInfo(dateInfo, hour);

    const arrayData = onlyOneOnPlace
      ? preparedData[key]?.slice(-1)
      : preparedData[key] || [];
    const numOfElements = onlyOneOnPlace && (preparedData[key]?.length || 0);

    return (arrayData || []).map((value, index) => (
      <div
        data-cy="CalendarInfoCard"
        data-card-date={dateInfo.date}
        key={`${index}-${dateInfo.date}`}
        className={calendarStyles['cells-component-row__item']}
        style={{
          gridColumn: `${idx + 1} / ${idx + (value?.length || 1) + 1}`,
        }}
      >
        {value?.keykey} {value?.id} {numOfElements}
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
      onlyOneOnPlace={onlyOneOnPlace}
    />
  );
};

export default CalendarView;
