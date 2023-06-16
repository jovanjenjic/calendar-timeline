import type { MouseEventHandler, ReactNode } from 'react';

export type ButtonVariations = 'primary' | 'secondary' | 'link' | 'danger';

export type ButtonSizes = 'large' | 'medium' | 'small';

export interface ButtonAttributes {
  className?: string;
  id?: string;
  [key: string]: any;
}

export type ButtonLabels =
  | { label: string; children?: never }
  | { label?: never; children: ReactNode }
  | { label?: never; children?: never; iconName: any };

export type ButtonBase = {
  className?: string;
  noPadding?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variation?: ButtonVariations;
  width?: 'fit' | 'full';
  size?: ButtonSizes;
  disabled?: boolean;
  loading?: boolean;
  attributes?: ButtonAttributes;
  iconName?: any;
  iconPosition?: 'left' | 'right';
  iconSize?: { width?: number; height?: number };
  iconColoringMode?: any;
};

export type ButtonComponent = ButtonBase & ButtonLabels;
