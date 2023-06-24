export interface DateInfo {
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
  date: string;
  day: number;
  month: number;
  year: number;
  [key: string]: any;
}

export interface DateInfoFunction {
  dateInfo: DateInfo;
  idx: number;
  hour: number;
}

export enum CurrentView {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  WEEK_TIME = 'WEEK_TIME',
  DAY = 'DAY',
}

export enum CellDisplayModeState {
  ALL_COLLAPSED = 'ALL_COLLAPSED',
  ALL_EXPANDED = 'ALL_EXPANDED',
  CUSTOM = 'CUSTOM',
}

export enum WeekStartsOn {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface ColorDot {
  color: string;
  text: string;
  date: string;
  [key: string]: any;
}

export interface CellData {
  date: string;
  day: number;
  month: number;
  year: number;
  cellKey: string;
  hour?: number;
}

export interface CellDisplayMode {
  [key: string]: {
    state: CellDisplayModeState;
    inactiveCells: string[];
  };
}

export interface TimeFormat {
  day: string;
  hour: string;
  hourTimeZone: string;
  monthYear: string;
  weekStartsOn?: WeekStartsOn;
}

export interface CalendarProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  currentView: CurrentView;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  colorDots?: ColorDot[];
  onDayNumberClick: (day: Date) => void;
  onDayStringClick: (day: Date) => void;
  onHourClick: (value: CellData) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: CellData) => void;
  timeDateFormat: TimeFormat;
}

export interface CalendarViewProps {
  data: Record<string, any>[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
  activeTimeDateField: string;
  currentView: CurrentView;
  cellDisplayMode: CellDisplayMode;
  colorDots: ColorDot[];
  onDayNumberClick: (day: Date) => void;
  onDayStringClick: (day: Date) => void;
  onHourClick: (value: CellData) => void;
  onColorDotClick: (value: ColorDot) => void;
  onItemClick: (item: Record<string, any>) => void;
  onCellClick: (value: CellData) => void;
  timeDateFormat: TimeFormat;
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string) => void;
  currentView: CurrentView;
  currentDate: string;
  timeDateFormat: TimeFormat;
}
