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
}

export enum CurrentView {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
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
  colorDots: ColorDot[];
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string) => void;
  currentView: CurrentView;
  currentDate: string;
}
