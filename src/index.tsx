import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarView from './components/Calendar/CalendarView';
import dataViewConfig from '@base/dataView';
import GoUrbanStyleguide from './components/style-guide/GoUrbanStyleguide';

const Playground = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-03');

  const dataView = dataViewConfig(currentDate, setCurrentDate);
  return (
    <div style={{ padding: '80px' }}>
      <GoUrbanStyleguide />
      <CalendarView {...dataView} />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<Playground />);
