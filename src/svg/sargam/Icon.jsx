/* / eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color   = dark ? '#e0e0e0' : '#000000';
  const opacity = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <g transform='scale(21.33)'>
          <path d='m3 5 10 7-10 7V5Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' />
        </g>
      </g>
    </svg>
  );
}
