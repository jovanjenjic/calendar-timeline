import React from 'react';

import { ButtonProps } from './Button.types';
import buttonStyles from './Button.module.scss';

const Button: React.FC<ButtonProps> = ({
  onClick,
  arrowSide,
  label,
  dataCy,
  withBorder,
}) => {
  return (
    <button
      data-cy={dataCy}
      onClick={onClick}
      className={`
        ${buttonStyles['arrow-button']}
        ${buttonStyles[`arrow-button__${arrowSide}`]}
        ${withBorder && buttonStyles['arrow-button--border']}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
