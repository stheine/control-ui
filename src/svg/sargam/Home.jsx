/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color      = dark ? '#e0e0e0' : '#000000';
  const innerColor = dark ? '#a0a0a0' : '#f0f0f0';
  const opacity    = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <g transform='scale(21.33)'>
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.6) translate(8 8)'>
            <path d='M5,10 L5,19 C5,19.5523 5.44772,20 6,20 L18,20 C18.5523,20 19,19.5523 19,19 L19,10' stroke={color} strokeWidth='1.5' strokeLinecap='round' fill={innerColor} />
            <path d='M21,11 L12.307,4.23875 C12.1264,4.09832 11.8736,4.09832 11.693,4.23875 L3,11' stroke={color} strokeWidth='1.5' strokeLinecap='round' fill={innerColor} />
          </g>
        </g>
      </g>
    </svg>
  );
}
