export interface DateInfo {
  isCurrentDay: boolean;
  isCurrentMonth?: boolean;
  date: string;
  day: number;
  month: number;
  year: number;
}
export interface DateInfoFunction {
  dateInfo: DateInfo;
  idx: number;
  hour?: number;
}
export interface DateInfoExtendedFunction {
  dateInfo: DateInfo;
  hour: number;
  idx: number;
}

export interface PreparedDataWithoutTime {
  isStart: boolean;
  length: number;
  [key: string]: any;
}

export interface PreparedDataWithTime {
  startMinute: number;
  endMinute: number;
  fromPreviousDay?: boolean;
  numberInRow?: number;
  margin?: string;
  width?: string;
  left?: string;
  [key: string]: any;
}
export interface PreparedDataWithTimeFull {
  week: PreparedDataWithTime[];
  day: Record<string, PreparedDataWithTime>[];
}

export interface PreparedDataWithTimeInPlace {
  [key: string]: any;
}

export enum CurrentView {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  WEEK_TIME = 'WEEK_TIME',
  DAY = 'DAY',
  WEEK_IN_PLACE = 'WEEK_IN_PLACE',
  DAY_IN_PLACE = 'DAY_IN_PLACE',
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

export interface ColorDotFull {
  dateKeys: Record<string, ColorDot>[] | object;
  colorKeys: Record<string, ColorDot>[] | object;
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
  renderHeaderItems: (
    startDate: string,
    endDate?: string,
  ) => (JSX.Element | null)[];
  currentView: CurrentView;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  colorDots?: ColorDot[];
  onDayNumberClick: (day: Date) => void;
  onDayStringClick: (day: Date) => void;
  onHourClick: (value: CellData) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: any) => void;
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
  onCellClick: (value: any) => void;
  timeDateFormat: TimeFormat;
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string) => void;
  currentView: CurrentView;
  currentDate: string;
  timeDateFormat: TimeFormat;
}

export interface CalculateStartAndEndMinuteFunc {
  startMinute: number;
  endMinute: number;
}
