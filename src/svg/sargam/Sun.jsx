/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color      = dark ? '#e0e0e0' : '#000000';
  const innerColor = dark ? '#a0a0a0' : '#ffffff';
  const opacity    = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <g transform='scale(21.33)'>
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.6) translate(8 8)'>
            <path d='M12 4V2M12 22v-2M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M17.66 17.66l1.41 1.41M4.93 4.93l1.41 1.41' stroke={color} strokeWidth='1.5' strokeMiterlimit='10' strokeLinecap='round' />
            <path d='M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' fill={innerColor} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          </g>
        </g>
      </g>
    </svg>
  );
}
