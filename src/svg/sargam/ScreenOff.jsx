/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick, onMouseDown, onMouseUp} = props;
  const color   = dark ? '#e0e0e0' : '#000000';
  const opacity = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(21.33)'>
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.4) translate(14 13)'>
            <path fill={color} d='M28,22H11.41L30,3.41,28.59,2l-2,2H4A2,2,0,0,0,2,6V22H4V6H24.59L2,28.59,3.41,30l6-6H12v4H8v2H24V28H20V24h8a2,2,0,0,0,2-2V9H28ZM18,28H14V24h4Z' />
          </g>
        </g>
      </g>
    </svg>
  );
}
