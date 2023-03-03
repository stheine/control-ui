/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color      = dark ? '#e0e0e0' : '#000000';
  const opacity    = dark ? '0.4'     : '0.16';
  const innerColor = dark ? '#a0a0a0' : '#f0f0f0';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(21.33)'>
          <path d='M17 6H7a6 6 0 1 0 0 12h10a6 6 0 0 0 0-12Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <path d='M17 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' fill={innerColor} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.7) translate(-1 5)'>
            <path fill={innerColor} stroke={innerColor} strokeWidth='0.4' d='M16.2803,8.71968 C16.5732,9.01258 16.5732,9.48746 16.2803,9.78034 L11.2803,14.7801 C10.9874,15.073 10.5125,15.073 10.2197,14.7801 L8.21586,12.7763 C7.92297,12.4834 7.92297,12.0085 8.21586,11.7157 C8.50875,11.4228 8.98363,11.4228 9.27652,11.7157 L10.75,13.1891 L15.2197,8.71966 C15.5126,8.42677 15.9874,8.42678 16.2803,8.71968 Z' />
          </g>
        </g>
      </g>
    </svg>
  );
}

