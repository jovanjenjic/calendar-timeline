import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarView from './components/Calendar/CalendarView';
import dataViewConfig from '@base/dataView';
import GoUrbanStyleguide from './components/style-guide/GoUrbanStyleguide';
import {
  CellData,
  CellDisplayModeState,
} from './components/Calendar/Calendar.types';

const Playground = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-03');
  const [cellDisplayMode, setCellDisplayMode] = React.useState({
    activeCells: [''],
    state: CellDisplayModeState.CUSTOM,
  });

  const onDayNumberClick = (day) => console.log('day', day);
  const onDayStringClick = (day) => console.log(day);
  const onHourClick = (day) => console.log(day);
  const onColorDotClick = (day) => console.log('color', day);
  const onItemClick = (item) => console.log('item', item);
  const onCellClick = (value: CellData) => {
    setCellDisplayMode(() => {
      if (cellDisplayMode.activeCells.includes(value.cellKey)) {
        return {
          ...cellDisplayMode,
          activeCells: cellDisplayMode.activeCells.filter(
            (val) => val !== value?.cellKey,
          ),
        };
      }
      return {
        ...cellDisplayMode,
        activeCells: [...cellDisplayMode.activeCells, value?.cellKey],
      };
    });
  };

  const dataView = dataViewConfig(currentDate, setCurrentDate, cellDisplayMode);
  return (
    <div style={{ padding: '80px' }}>
      <GoUrbanStyleguide />
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
