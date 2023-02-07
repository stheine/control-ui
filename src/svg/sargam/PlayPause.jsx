/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color      = dark ? '#e0e0e0' : '#000000';
  const opacity    = dark ? '0.4'     : '0.16';
  const innerColor = dark ? '#a0a0a0' : '#ffffff';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <g transform='scale(21.33)'>
          <path fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeLinejoin='round' d='m10.7 5 10 7-10 7V5Z' />
          <path d='M6 5h-2.4a.8.8 0 0 0-.8.8v12.4a.8.8 0 0 0 .8.8h2.4a.8.8 0 0 0 .8-.8V5.8a.8.8 0 0 0-.8-.8Z' fill={innerColor} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
        </g>
      </g>
    </svg>
  );
}
