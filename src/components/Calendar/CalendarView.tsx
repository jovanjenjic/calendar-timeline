import React, { ReactElement } from 'react';
import {
  CalendarViewProps,
  CurrentView,
  DateInfoFunction,
  PreparedDataWithTimeFull,
  PreparedDataWithTimeInPlace,
  PreparedDataWithoutTime,
} from '../Calendar/Calendar.types';
import calendarStyles from '../Calendar/Calendar.module.scss';
import {
  formatFullDate,
  prepareCalendarData,
  prepareCalendarDataInPlace,
  prepareCalendarDataWithTime,
} from '../../utils/index';
import {
  shouldCollapse,
  shouldShowItem,
  calculatePosition,
  getKeyFromDateInfo,
} from './Calendar.helper';
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
  const preparedData:
    | PreparedDataWithTimeFull
    | Record<string, PreparedDataWithoutTime[]>[]
    | PreparedDataWithTimeInPlace = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.DAY:
      case CurrentView.WEEK_TIME:
        return prepareCalendarDataWithTime(data, activeTimeDateField);
      case CurrentView.MONTH:
      case CurrentView.WEEK:
        return prepareCalendarData(
          data,
          activeTimeDateField,
          timeDateFormat?.weekStartsOn ?? 1,
        );
      case CurrentView.DAY_IN_PLACE:
      case CurrentView.WEEK_IN_PLACE:
        return prepareCalendarDataInPlace(data, activeTimeDateField);
    }
  }, [data, activeTimeDateField, currentView]);

  const renderItemsWithoutTimeOrInPlace = ({
    dateInfo,
    idx,
    hour,
  }: DateInfoFunction): ReactElement[] => {
    const key = hour
      ? getKeyFromDateInfo(dateInfo, hour)
      : formatFullDate(new Date(dateInfo.date));

    const isCollapsed = shouldCollapse(cellDisplayMode, currentView, key);

    const arrayData: PreparedDataWithoutTime[] =
      (isCollapsed ? preparedData?.[key]?.slice(-1) : preparedData?.[key]) ||
      [];

    return arrayData.map((preparedDataItem, index) => {
      return shouldShowItem(
        preparedDataItem,
        key,
        cellDisplayMode,
        currentView,
        preparedData,
        currentDate,
      ) ? (
        <div
          key={`${index}-${dateInfo.date}`}
          style={{
            gridColumn: `${idx + 1} / ${
              idx + (isCollapsed ? 1 : preparedDataItem?.length || 1) + 1
            }`,
          }}
          className={calendarStyles['calendar-item']}
        >
          <div>
            <p
              style={{ background: 'lime', margin: '10px' }}
              onClick={() => onItemClick(preparedDataItem)}
            >
              {preparedDataItem?.id}
            </p>
          </div>
        </div>
      ) : (
        <></>
      );
    });
  };

  const renderItemsWithTime = ({
    dateInfo,
  }: DateInfoFunction): ReactElement[] => {
    const key = formatFullDate(new Date(dateInfo.date));

    return ((preparedData as PreparedDataWithTimeFull).day[key] || []).map(
      (preparedDataItem, index) => {
        return (
          <div
            key={`${index}-${dateInfo.date}`}
            style={{
              gridRow: `${+preparedDataItem.startMinute} / ${+preparedDataItem.endMinute}`,
              gridColumn: '1 / 3',
              backgroundColor: 'rgba(0, 0, 255, 0.5)',
              border: '1px solid white',
              width: preparedDataItem.width || '99%',
              position: 'relative',
              left: preparedDataItem.left || '0%',
              margin: preparedDataItem.margin,
            }}
          >
            <p onClick={() => onItemClick(preparedDataItem)}>
              {preparedDataItem?.id}
            </p>
          </div>
        );
      },
    );
  };

  const renderHeaderItems = (
    startDate: string,
    endDate?: string,
  ): (JSX.Element | null)[] => {
    const weekItems = preparedData as PreparedDataWithTimeFull;

    return weekItems.week.map((preparedDataItem, index) => {
      const gridColumn = calculatePosition(
        startDate,
        endDate || startDate,
        preparedDataItem[preparedDataItem.startIntervalKey],
        preparedDataItem[preparedDataItem.endIntervalKey],
        timeDateFormat.weekStartsOn ?? 1,
      );

      if (!gridColumn) {
        return null;
      }

      return (
        <div
          key={`${index}-${startDate}`}
          style={{
            gridColumn,
            background: 'lime',
            margin: '5px',
          }}
          className={calendarStyles['calendar-item']}
        >
          <p onClick={() => onItemClick(preparedDataItem)}>
            {preparedDataItem?.id}
          </p>
        </div>
      );
    });
  };

  const renderItems = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.DAY:
      case CurrentView.WEEK_TIME:
        return renderItemsWithTime;
      case CurrentView.MONTH:
      case CurrentView.WEEK:
      case CurrentView.WEEK_IN_PLACE:
      case CurrentView.DAY_IN_PLACE:
        return renderItemsWithoutTimeOrInPlace;
      default:
        return renderItemsWithoutTimeOrInPlace;
    }
  }, [currentView, cellDisplayMode]);

  return (
    <CalendarComponent
      renderItems={renderItems}
      renderHeaderItems={renderHeaderItems}
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
