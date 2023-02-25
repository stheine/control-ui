/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color   = dark ? '#e0e0e0' : '#000000';
  const opacity = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <g transform='scale(21.33)'>
          <path d='M17 6H7a6 6 0 1 0 0 12h10a6 6 0 0 0 0-12Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <circle fill={color} cx={8} cy={12} r={1.5} />
          <circle fill={color} cx={12} cy={12} r={1.5} />
          <circle fill={color} cx={16} cy={12} r={1.5} />
        </g>
      </g>
    </svg>
  );
}
