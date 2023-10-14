/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color   = dark ? '#e0e0e0' : '#000000';
  const opacity = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(21.33)'>
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <rect x='8.2' y='6' width='8' height='12' rx='1.5' stroke={color} fill='none' />
          <line x1='12.2' y1='8' x2='12.2' y2='16' rx='1.5' stroke={color} fill='none' strokeLinecap='round' />
          <line x1='12.2' y1='8' x2='10.2' y2='10' rx='1.5' stroke={color} fill='none' strokeLinecap='round' />
          <line x1='12.2' y1='8' x2='14.2' y2='10' rx='1.5' stroke={color} fill='none' strokeLinecap='round' />
        </g>
      </g>
    </svg>
  );
}
