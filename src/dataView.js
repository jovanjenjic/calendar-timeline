import {
  CurrentView,
  WeekStartsOn,
} from '@base/components/Calendar/Calendar.types';

const data = [
  {
    id: 1111,
    updatedAt: '2023-06-03T20:54:22.620702Z',
    createdAt: '2023-06-01T10:05:06.628591Z',
  },
  {
    id: 2222,
    updatedAt: '2023-06-04T23:00:00Z',
    createdAt: '2023-06-01T10:05:06.628591Z',
  },
  {
    id: 3333,
    updatedAt: '2023-06-03T23:00:00Z',
    createdAt: '2023-06-03T10:05:06.628591Z',
  },
  {
    id: 4444,
    updatedAt: '2023-06-25T23:00:00Z',
    createdAt: '2023-06-05T10:05:06.628591Z',
  },
  {
    id: 5555,
    updatedAt: '2023-06-25T23:00:00Z',
    createdAt: '2023-05-05T10:05:06.628591Z',
  },
];

const colorDots = [
  {
    color: 'blue',
    text: 'Text about blue color',
    date: '2023-06-02',
  },
  {
    color: 'red',
    text: 'Text about red color',
    date: '2023-06-03',
  },
  {
    color: 'green',
    text: 'Text about green color',
    date: '2023-06-04',
  },
  {
    color: 'green',
    text: 'Text about green color',
    date: '2023-06-05',
  },
];

const dataViewConfig = (currentDate, setCurrentDate, cellDisplayMode) => ({
  data: data,
  currentDate,
  setCurrentDate,
  onItemClick: () => {
    (() => [1, 2].map())();
  },
  currentView: CurrentView.MONTH,
  cellDisplayMode,
  timeDateFormat: {
    day: 'EEE',
    hour: 'hh a',
    hourTimeZone: 'z',
    monthYear: 'LLLL yyyy',
    weekStartsOn: WeekStartsOn.MONDAY,
  },
  activeTimeDateField: 'createdAt-updatedAt',
  colorDots,
});

export default dataViewConfig;
