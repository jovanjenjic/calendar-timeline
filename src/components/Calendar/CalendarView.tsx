import React from 'react';
import Calendar from '@base/components/Calendar/Calendar';
import {
  CalendarViewProps,
  CellDisplayModeState,
  CurrentView,
  DateInfoFunction,
} from '@base/components/Calendar/Calendar.types';
import calendarStyles from '@components/Calendar/Calendar.module.scss';
import {
  prepareCalendarData,
  prepareCalendarDataWeekHours,
} from '@base/utils/index';
import { getKeyFromDateInfo } from './Calendar.helper';

const CalendarView: React.FC<CalendarViewProps> = ({
  data,
  currentDate,
  setCurrentDate,
  activeTimeDateField,
  currentView,
  cellDisplayMode,
  colorDots,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onItemClick,
  onCellClick,
}) => {
  // Prepared data so that for each item in the array there is all the data as well as the length of the interval
  const preparedData = React.useMemo(
    () =>
      currentView === CurrentView.WEEK_HOURS || currentView === CurrentView.DAY
        ? prepareCalendarDataWeekHours(data, activeTimeDateField)
        : prepareCalendarData(data, activeTimeDateField),
    [data, activeTimeDateField, currentView],
  );

  // Based on the prepared data, it is iterated through each day of the week and all elements in
  // that data are placed at the appropriate position and length within grid container.
  const renderItems = ({ dateInfo, idx, hour }: DateInfoFunction) => {
    const key = getKeyFromDateInfo(currentView, dateInfo, hour);

    const arrayData =
      cellDisplayMode.state === CellDisplayModeState.ALL_COLLAPSED ||
      (cellDisplayMode.state === CellDisplayModeState.CUSTOM &&
        cellDisplayMode.activeCells.includes(key))
        ? preparedData[key]?.slice(-1)
        : preparedData[key] || [];

    return (arrayData || []).map((value, index) => (
      <div
        key={`${index}-${dateInfo.date}`}
        style={{
          gridColumn: `${idx + 1} / ${
            idx +
            (cellDisplayMode.state === CellDisplayModeState.ALL_COLLAPSED ||
            (cellDisplayMode.state === CellDisplayModeState.CUSTOM &&
              cellDisplayMode.activeCells.includes(key))
              ? 1
              : value?.length || 1) +
            1
          }`,
        }}
        className={calendarStyles['calendar-item']}
      >
        <>
          <p onClick={() => onItemClick(value)}>
            {value?.keykey} {value?.id}
          </p>
        </>
      </div>
    ));
  };

  return (
    <Calendar
      renderItems={renderItems}
      setCurrentDate={setCurrentDate}
      currentView={currentView}
      colorDots={colorDots}
      currentDate={currentDate}
      onDayNumberClick={onDayNumberClick}
      onDayStringClick={onDayStringClick}
      onHourClick={onHourClick}
      onColorDotClick={onColorDotClick}
      onCellClick={onCellClick}
    />
  );
};

export default CalendarView;
