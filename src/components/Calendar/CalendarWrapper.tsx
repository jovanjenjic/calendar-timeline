import React, { ReactElement } from 'react';
import {
  CalendarViewProps,
  CurrentView,
  DateInfoFunction,
  PreparedDataWithTimeFull,
  PreparedDataWithTimeInPlace,
  PreparedDataWithoutTime,
} from './Calendar.types';
import calendarStyles from '../Calendar/Calendar.module.scss';
import {
  formatFullDate,
  formatHour,
  formatMonthDayHour,
  prepareCalendarData,
  prepareCalendarDataInPlace,
  prepareCalendarDataWithTime,
} from '../../utils/index';
import {
  shouldCollapse,
  shouldShowItem,
  calculatePosition,
  getKeyFromDateInfo,
  isFromPreviousOrNextDateUnit,
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
  const [hoveredElement, setHoveredElement] = React.useState(0);
  const [startIntervalKey, endIntervalKey] = (activeTimeDateField ?? '')
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

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
          onMouseEnter={() => setHoveredElement(preparedDataItem?.id)}
          onMouseLeave={() => setHoveredElement(0)}
          className={`
            ${calendarStyles['item']}
            ${
              hoveredElement === preparedDataItem.id &&
              calendarStyles['item--hovered']
            }
          `}
        >
          <div
            className={`
              ${calendarStyles['sub-item']}
              ${
                hoveredElement === preparedDataItem.id &&
                calendarStyles['sub-item--hovered']
              }
              ${
                preparedDataItem?.isStart &&
                calendarStyles['sub-item--left-border']
              }
            `}
          >
            <p onClick={() => onItemClick(preparedDataItem)}>
              <div>{preparedDataItem?.title}</div>
              <div>
                {formatMonthDayHour(
                  new Date(preparedDataItem[startIntervalKey]),
                )}
                {endIntervalKey &&
                  `${
                    ' - ' +
                    formatMonthDayHour(
                      new Date(preparedDataItem[endIntervalKey]),
                    )
                  }`}
              </div>
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
              width: preparedDataItem.width,
              left: preparedDataItem.left,
              margin: preparedDataItem.margin,
            }}
            onMouseEnter={() => setHoveredElement(preparedDataItem?.id)}
            onMouseLeave={() => setHoveredElement(0)}
            className={`
              ${calendarStyles['item']}
              ${
                hoveredElement === preparedDataItem.id &&
                calendarStyles['item--hovered']
              }
            `}
          >
            <p
              className={`
                ${calendarStyles['sub-item']}
                ${
                  hoveredElement === preparedDataItem.id &&
                  calendarStyles['sub-item--hovered']
                }
              `}
              style={{
                backgroundColor: preparedDataItem?.bgColor,
                color: preparedDataItem?.textColor,
              }}
              onClick={() => onItemClick(preparedDataItem)}
            >
              <div>{preparedDataItem?.title}</div>
              <div>
                {formatHour(new Date(preparedDataItem[startIntervalKey]))}
                {endIntervalKey &&
                  `${
                    ' - ' +
                    formatHour(new Date(preparedDataItem[endIntervalKey]))
                  }`}
              </div>
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
        preparedDataItem[startIntervalKey],
        preparedDataItem[endIntervalKey],
        timeDateFormat.weekStartsOn ?? 1,
      );

      if (!gridColumn) {
        return null;
      }

      const isFromPreviousOrNext = isFromPreviousOrNextDateUnit(
        startDate,
        endDate || startDate,
        preparedDataItem[startIntervalKey],
        preparedDataItem[endIntervalKey],
        currentView,
        timeDateFormat.weekStartsOn ?? 1,
      );

      return (
        <div
          key={`${index}-${startDate}`}
          style={{
            gridColumn,
          }}
          className={calendarStyles['item']}
        >
          <p
            className={`
              ${calendarStyles['sub-item']}
              ${
                isFromPreviousOrNext[0] &&
                calendarStyles['sub-item--left-arrow']
              }
              ${
                isFromPreviousOrNext[1] &&
                calendarStyles['sub-item--right-arrow']
              }
            `}
            onClick={() => onItemClick(preparedDataItem)}
            style={{
              backgroundColor: preparedDataItem?.bgColor,
              color: preparedDataItem?.textColor,
            }}
          >
            <div>{preparedDataItem?.title}</div>
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
  }, [currentView, cellDisplayMode, hoveredElement]);

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
