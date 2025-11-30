/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick, onMouseDown, onMouseUp} = props;
  const color      = dark ? '#e0e0e0' : '#000000';
  const opacity    = dark ? '0.4'     : '0.16';
  const innerColor = dark ? '#a0a0a0' : '#ffffff';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(21.33)'>
          <path d='m21 5-10 7 10 7V5Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeLinejoin='round' />
          <path d='M4.8 5h2.4a.8.8 0 0 1 .8.8v12.4a.8.8 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8V5.8a.8.8 0 0 1 .8-.8Z' fill={innerColor} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
        </g>
      </g>
    </svg>
  );
}
