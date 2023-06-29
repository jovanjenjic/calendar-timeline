import {
  CellData,
  ColorDot,
  ColorDotFull,
  CurrentView,
  DateInfoFunction,
  TimeFormat,
} from '../Calendar.types';

export interface DayTimeViewProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  renderHeaderItems: (
    startDate: string,
    endDate?: string,
  ) => (JSX.Element | null)[];
  currentView: CurrentView;
  currentDate: string;
  onDayNumberClick: (day: Date) => void;
  onDayStringClick: (day: Date) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: CellData) => void;
  timeDateFormat: TimeFormat;
  preparedColorDots: ColorDotFull;
  onHourClick: (value: CellData) => void;
}
