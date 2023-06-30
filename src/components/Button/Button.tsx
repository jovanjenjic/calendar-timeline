import React from 'react';
import cn from 'classnames';

import { ButtonProps } from './Button.types';
import buttonStyles from './Button.module.scss';

const Button: React.FC<ButtonProps> = ({
  onClick,
  arrowSide,
  label,
  dataCy,
}) => {
  return (
    <button
      data-cy={dataCy}
      onClick={onClick}
      className={cn(
        buttonStyles['arrow-button'],
        buttonStyles[`arrow-button__${arrowSide}`],
      )}
    >
      {label}
    </button>
  );
};

export default Button;
