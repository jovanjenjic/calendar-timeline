import React from 'react';
import './GoUrbanStyleguide.scss';

export const blueColorVariations = () => {
  return `
      --b-500: #1B53C4;
      --b-400: #2268F5;
      --b-300: #6195FD;
      --b-200: #9CBDFF;
      --b-100: #D0E0FF; 
      --b-50: #E9F0FE; 
    `;
};

export const greenColorVariations = () => {
  return `
      --g-500: #25AC4B;
      --g-400: #2EC859;
      --g-300: #6BE18D;
      --g-200: #96F8B2;
      --g-100: #C2FFD4;
      --g-50: #EDFFF3;
    `;
};

export const redColorVariations = () => {
  return `
      --r-500: #D43131;
      --r-400: #F44747;
      --r-300: #F98080;
      --r-200: #FFB4B4;
      --r-100: #FFD3D3;
      --r-50: #FFEEEE;
    `;
};

export const yellowColorVariations = () => {
  return `
      --y-500: #DA9E03;
      --y-400: #F0B41A;
      --y-300: #FBC848;
      --y-200: #FCDA84;
      --y-100: #FFE9B2;
      --y-50: #FFF3D4; 
    `;
};

export const orangeColorVariations = () => {
  return `
      --o-600: #f08300;
      --o-500: #E35F2E;
      --o-400: #EE7A4C;
      --o-300: #F0916B;
      --o-200: #F3B094;
      --o-100: #F7CFBF;
      --o-50: #F8E9E7; 
    `;
};

export const purpleColorVariations = () => {
  return `
      --p-500: #4C1CB8;
      --p-400: #642EDC;
      --p-300: #824CFA;
      --p-200: #9F74FF;
      --p-100: #CBB4FF;
      --p-50: #EDE5FF; 
    `;
};

export const extraColorVariations = () => {
  return `
      --background-1: #F0F2F5;
      --background-2: #001529;
      --background-3: #000C17;
    `;
};

export const grayScaleColorVariations = () => {
  return `
      --gs-900: #0A0E14;
      --gs-800: #2A313C;
      --gs-700: #3D4757;
      --gs-600: #58667B;
      --gs-500: #718096;
      --gs-400: #8898AC;
      --gs-300: #A0AEC0;
      --gs-200: #CBD5E0;
      --gs-100: #F9F9F9;
      --gs-50: #FEFEFE;
      --gs-0: #FFFFFF;
    `;
};

export const fontVariations = () => {
  return `
      --font-h-1: normal normal 500 48px/60px 'Inter', sans-serif;
      --font-h-2: normal normal 500 36px/48px 'Inter', sans-serif;
      --font-h-3: normal normal 500 24px/32px 'Inter', sans-serif;
      --font-h-4: normal normal 500 20px/28px 'Inter', sans-serif;
      --font-h-5: normal normal 500 16px/24px 'Inter', sans-serif;
      --font-h-6: normal normal 500 14px/20px 'Inter', sans-serif;
      --font-h-7: normal normal 500 12px/18px 'Inter', sans-serif;

      --font-p-1: normal normal 400 18px/28px 'Inter', sans-serif;
      --font-p-2: normal normal 400 16px/24px 'Inter', sans-serif;
      --font-p-3: normal normal 400 14px/22px 'Inter', sans-serif;
      --font-p-4: normal normal 400 12px/20px 'Inter', sans-serif;

      --font-c-1: normal normal 600 14px/20px 'Inter', sans-serif;
      --font-c-2: normal normal 600 12px/16px 'Inter', sans-serif;
      --font-c-3: normal normal 600 10px/16px 'Inter', sans-serif;

      --font-w-regular: 400;
      --font-w-medium: 500;
      --font-w-semibold: 600;
      --font-w-bold: 700;
    `;
};

/**
 * New colors and styling
 * Refer to: https://www.figma.com/file/Ckxbd5Tdg2nda5yFp3TuZH/Dashboard?node-id=2850%3A6279
 */
const GoUrbanStyleguide = () => {
  const minifyCssString = (css: string) => {
    return css.replace(/\n/g, '').replace(/\s\s+/g, ' ');
  };

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: minifyCssString(`:root {
          ${blueColorVariations()}
          ${grayScaleColorVariations()}
          ${redColorVariations()}
          ${yellowColorVariations()}
          ${greenColorVariations()}        
          ${orangeColorVariations()}
          ${extraColorVariations()}
          ${fontVariations()}
          ${purpleColorVariations()}
            --spacing: 8px;
            --overlay: rgba(0, 0, 0, 0.25);
            --box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
            --black: #1C1C1C;
            --white: #FFFFFF;
          }
        `),
      }}
    />
  );
};

export default GoUrbanStyleguide;
