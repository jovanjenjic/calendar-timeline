import {
  CurrentView,
  WeekStartsOn,
} from './components/Calendar/Calendar.types';

const data = [
  {
    id: 1111,
    updatedAt: '2023-06-06T20:54:22.620702Z',
    createdAt: '2023-05-10T03:05:06.628591Z',
    title: 'Codeference',
  },
  {
    id: 2222,
    updatedAt: '2023-06-01T06:03:00Z',
    createdAt: '2023-06-01T05:05:06.628591Z',
    title: 'Intervju call',
  },
  {
    id: 3333,
    updatedAt: '2023-06-02T07:40:00Z',
    createdAt: '2023-06-02T02:45:06.628591Z',
    title: 'Codeday',
  },
  {
    id: 4444,
    updatedAt: '2023-06-02T05:00:00Z',
    createdAt: '2023-06-02T03:30:00Z',
    title: 'Sastanak upoznavanja',
  },
  {
    id: 5555,
    updatedAt: '2023-06-05T07:00:00Z',
    createdAt: '2023-05-02T06:05:06.628591Z',
    title: 'Codefair',
  },
  {
    id: 6666,
    updatedAt: '2023-06-02T06:00:00Z',
    createdAt: '2023-06-02T02:35:00Z',
    title: 'Dejli',
  },
  {
    id: 7777,
    updatedAt: '2023-06-02T05:00:00Z',
    createdAt: '2023-06-02T02:50:00Z',
    title: 'Druzenje Unije',
  },
  {
    id: 8888,
    updatedAt: '2023-06-03T00:10:00Z',
    createdAt: '2023-06-02T01:10:00Z',
    title: 'Dobar film',
  },
];

const colorDots = [
  {
    color: 'orange',
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
];

const dataProp = (
  currentDate,
  setCurrentDate,
  cellDisplayMode = {},
  setCellDisplayMode,
) => ({
  data: data,
  currentDate,
  setCurrentDate,
  currentView: CurrentView.WEEK_TIME,
  cellDisplayMode,
  setCellDisplayMode,
  timeDateFormat: {
    day: 'EEE',
    hour: 'hh a',
    monthYear: 'LLLL yyyy',
    weekStartsOn: WeekStartsOn.MONDAY,
  },
  activeTimeDateField: 'createdAt-updatedAt',
  colorDots,
});

export default dataProp;
