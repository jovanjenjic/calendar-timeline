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
  WEEK_HOURS = 'WEEK_HOURS',
  DAY = 'DAY',
}

export enum CellDisplayModeState {
  ALL_COLLAPSED = 'ALL_COLLAPSED',
  ALL_EXPANDED = 'ALL_EXPANDED',
  CUSTOM = 'CUSTOM',
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

interface CellDisplayMode {
  state: CellDisplayModeState;
  activeCells: string[];
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
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string) => void;
  currentView: CurrentView;
  currentDate: string;
}
