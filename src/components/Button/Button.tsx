import React, { forwardRef } from 'react';
import cn from 'classnames';

import Svg from '@components/Svg/Svg';
import { ButtonComponent } from './Button.types';
import cssModule from './Button.module.scss';

const Button = forwardRef<HTMLButtonElement | null, ButtonComponent>(
  (
    {
      noPadding,
      onClick,
      label,
      children,
      variation = 'primary',
      width = 'fit',
      size = 'medium',
      disabled = false,
      loading = false,
      attributes,
      iconName,
      iconPosition = 'left',
      iconSize,
      iconColoringMode,
      className,
    },
    ref,
  ) => {
    const classes = [
      className && className,
      cssModule.button,
      noPadding && cssModule['button--no-padding'],
      cssModule[`button--${variation}`],
      cssModule[`button--${width}`],
      cssModule[`button--${size}`],
      !label && !children && cssModule['button--icon-only'],
      attributes?.className || null,
      disabled && cssModule['button--disabled'],
      loading && cssModule['button--loading'],
    ].filter(Boolean);

    const getIconFillColor = () => {
      if (iconColoringMode === 'stroke') return 'none';

      if (disabled) return 'var(--gs-500)';

      if (variation === 'secondary' || variation === 'link')
        return 'var(--gs-900)';

      return 'var(--white)';
    };

    const getIconStrokeColor = () => {
      if (iconColoringMode === 'fill' || !iconColoringMode) return 'none';

      if (disabled) return 'var(--gs-500)';

      if (variation === 'secondary' || variation === 'link')
        return 'var(--gs-900)';

      return 'var(--white)';
    };

    return (
      <button
        ref={ref}
        type="button"
        {...attributes}
        className={cn(...classes)}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {iconName && iconPosition === 'left' && !loading && (
          <Svg
            className={cn([
              cssModule.button__icon,
              cssModule['button__icon-left'],
            ])}
            width={iconSize?.width}
            height={iconSize?.height}
            icon={iconName}
            strokeColor={getIconStrokeColor()}
            iconColor={getIconFillColor()}
          />
        )}
        {!loading && (label || children)}
        {iconName && iconPosition === 'right' && !loading && (
          <Svg
            className={cn([
              cssModule.button__icon,
              cssModule['button__icon-right'],
            ])}
            width={iconSize?.width}
            height={iconSize?.height}
            icon={iconName}
            strokeColor={getIconStrokeColor()}
            iconColor={getIconFillColor()}
          />
        )}
      </button>
    );
  },
);

export default Button;
