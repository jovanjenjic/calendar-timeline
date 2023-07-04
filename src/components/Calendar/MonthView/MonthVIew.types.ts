import {
  CellData,
  ColorDot,
  ColorDotFull,
  CurrentView,
  DateInfoFunction,
  TimeFormat,
} from '../Calendar.types';

export interface MonthViewProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  currentView: CurrentView;
  currentDate: string;
  onDayNumberClick: (day: Date) => void;
  onDayStringClick: (day: Date) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: any) => void;
  timeDateFormat: TimeFormat;
  preparedColorDots: ColorDotFull;
}
