import {
  CellData,
  ColorDot,
  ColorDotFull,
  CurrentView,
  DateInfoExtendedFunction,
  TimeFormat,
} from '../Calendar.types';

export interface WeekInPlaceViewProps {
  renderItems: ({
    dateInfo,
    hour,
    idx,
  }: DateInfoExtendedFunction) => JSX.Element[];
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
