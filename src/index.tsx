import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarView from './components/Calendar/CalendarView';
import dataViewConfig from '../src/dataView';
import Styleguide from './components/StyleGuide/StyleGuide';
import {
  CellData,
  CellDisplayMode,
  CellDisplayModeState,
} from './components/Calendar/Calendar.types';

const Playground = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-03');
  const [cellDisplayMode, setCellDisplayMode] = React.useState<CellDisplayMode>(
    {
      MONTH: {
        inactiveCells: ['2023-06-03'],
        state: CellDisplayModeState.CUSTOM,
      },
      WEEK: {
        inactiveCells: ['2023-06-03'],
        state: CellDisplayModeState.CUSTOM,
      },
      WEEK_TIME: {
        inactiveCells: ['2023-06-03'],
        state: CellDisplayModeState.ALL_COLLAPSED,
      },
      DAY: {
        inactiveCells: ['2023-06-03'],
        state: CellDisplayModeState.CUSTOM,
      },
      DAY_IN_PLACE: {
        inactiveCells: ['2023-08-03'],
        state: CellDisplayModeState.CUSTOM,
      },
      WEEK_IN_PLACE: {
        inactiveCells: ['2023-08-03'],
        state: CellDisplayModeState.CUSTOM,
      },
    },
  );

  const onDayNumberClick = (day) => console.log('day', day);
  const onDayStringClick = (day) => console.log(day);
  const onHourClick = (day) => console.log(day);
  const onColorDotClick = (day) => console.log('color', day);
  const onItemClick = (item) => console.log('item', item);
  const onCellClick = (value) => {
    setCellDisplayMode(() => {
      if (cellDisplayMode['MONTH'].inactiveCells.includes(value.cellKey)) {
        return {
          ...cellDisplayMode,
          MONTH: {
            ...cellDisplayMode['MONTH'],
            inactiveCells: cellDisplayMode['MONTH'].inactiveCells.filter(
              (val) => val !== value?.cellKey,
            ),
          },
        };
      }
      return {
        ...cellDisplayMode,
        MONTH: {
          ...cellDisplayMode['MONTH'],
          inactiveCells: [
            ...cellDisplayMode['MONTH'].inactiveCells,
            value?.cellKey,
          ],
        },
      };
    });
  };

  const dataView = dataViewConfig(
    currentDate,
    setCurrentDate,
    cellDisplayMode,
    setCellDisplayMode,
  );
  return (
    <div style={{ padding: '30px' }}>
      <Styleguide />
      <CalendarView
        {...dataView}
        onDayNumberClick={onDayNumberClick}
        onDayStringClick={onDayStringClick}
        onHourClick={onHourClick}
        onColorDotClick={onColorDotClick}
        onItemClick={onItemClick}
        onCellClick={onCellClick}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<Playground />);
