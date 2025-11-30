/* eslint-disable max-len */

import React from 'react';

export default function Light(props) {
  const {dark, onClick, onMouseDown, onMouseUp} = props;
  const color   = dark ? '#e0e0e0' : '#000000';
  const opacity = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(21.33)'>
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.7) translate(5 5)'>
            <path d='M12 7C9.23858 7 7 9.23858 7 12C7 13.3613 7.54402 14.5955 8.42651 15.4972C8.77025 15.8484 9.05281 16.2663 9.14923 16.7482L9.67833 19.3924C9.86537 20.3272 10.6862 21 11.6395 21H12.3605C13.3138 21 14.1346 20.3272 14.3217 19.3924L14.8508 16.7482C14.9472 16.2663 15.2297 15.8484 15.5735 15.4972C16.456 14.5955 17 13.3613 17 12C17 9.23858 14.7614 7 12 7Z' stroke={color} fill='none' strokeWidth='2' />
            <path d='M12 4V3' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M18 6L19 5' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M20 12H21' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M4 12H3' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M5 5L6 6' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M10 17H14' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </g>
        </g>
      </g>
    </svg>
  );
}
