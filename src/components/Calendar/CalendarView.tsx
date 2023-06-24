import React from 'react';
import { parseISO, isBefore } from 'date-fns';
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
import { getAllDaysInMonth, getKeyFromDateInfo } from './Calendar.helper';
import CalendarComponent from './CalendarComponent';

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
  timeDateFormat,
}) => {
  // Prepared data so that for each item in the array there is all the data as well as the length of the interval
  const preparedData = React.useMemo(
    () =>
      currentView === CurrentView.WEEK_TIME || currentView === CurrentView.DAY
        ? prepareCalendarDataWeekHours(data, activeTimeDateField)
        : prepareCalendarData(
            data,
            activeTimeDateField,
            timeDateFormat?.weekStartsOn ?? 1,
          ),
    [data, activeTimeDateField, currentView],
  );

  const shouldShowItem = (itemInDayCell, currentDayCell) => {
    let retValue = true;
    if (
      itemInDayCell.isStart ||
      cellDisplayMode[currentView].state === CellDisplayModeState.ALL_EXPANDED
    ) {
      return true;
    }

    const calendarDays =
      cellDisplayMode[currentView].state === CellDisplayModeState.ALL_COLLAPSED
        ? getAllDaysInMonth(currentDate)
        : cellDisplayMode[currentView].inactiveCells;

    for (let i = 0; i < calendarDays.length && retValue; i++) {
      const dayCell = calendarDays[i];
      if (isBefore(parseISO(currentDayCell), parseISO(dayCell))) {
        retValue = true;
      } else if (currentDayCell !== dayCell) {
        const closedCellItems = preparedData[dayCell] || [];
        retValue = !closedCellItems.find(
          (item) => item.id === itemInDayCell.id,
        );
      }
    }

    return retValue;
  };

  // Based on the prepared data, it is iterated through each day of the week and all elements in
  // that data are placed at the appropriate position and length within grid container.
  const renderItems = ({ dateInfo, idx, hour }: DateInfoFunction) => {
    const dayCell = getKeyFromDateInfo(currentView, dateInfo, hour);

    const shouldCollapse =
      cellDisplayMode[currentView].state ===
        CellDisplayModeState.ALL_COLLAPSED ||
      (cellDisplayMode[currentView].state === CellDisplayModeState.CUSTOM &&
        cellDisplayMode[currentView].inactiveCells.includes(dayCell));

    const arrayData = shouldCollapse
      ? preparedData[dayCell]?.slice(-1) || []
      : preparedData[dayCell] || [];

    return arrayData.map((itemInDayCell, index) => {
      const shouldShow =
        currentView !== CurrentView.MONTH ||
        shouldShowItem(itemInDayCell, dayCell);

      return shouldShow ? (
        <div
          key={`${index}-${dateInfo.date}`}
          style={{
            gridColumn: `${idx + 1} / ${
              idx + (shouldCollapse ? 1 : itemInDayCell?.length || 1) + 1
            }`,
          }}
          className={calendarStyles['calendar-item']}
        >
          <div>
            <p
              style={{ background: 'lime', margin: '10px' }}
              onClick={() => onItemClick(itemInDayCell)}
            >
              {itemInDayCell?.keykey} {itemInDayCell?.id}
            </p>
          </div>
        </div>
      ) : (
        <></>
      );
    });
  };

  return (
    <CalendarComponent
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
      timeDateFormat={timeDateFormat}
    />
  );
};

export default CalendarView;
