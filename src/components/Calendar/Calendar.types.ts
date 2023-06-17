export interface DateInfo {
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
  date: string;
  day: number;
  month: number;
  year: number;
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
}

export interface ColorDot {
  color: string;
  text: string;
  date: string;
  [key: string]: any;
}

export interface CalendarProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  currentView: CurrentView;
  onlyOneOnPlace: boolean;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  colorDots?: ColorDot[];
  showNavigation?: boolean;
}

export interface CalendarViewProps {
  data: Record<string, any>[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
  activeTimeDateField: string;
  currentView: CurrentView;
  onlyOneOnPlace: boolean;
  colorDots: ColorDot[];
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string) => void;
  currentView: CurrentView;
  currentDate: string;
}
