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
          <path d='m8 5 10 7-10 7V5Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeLinejoin='round' />
        </g>
      </g>
    </svg>
  );
}
