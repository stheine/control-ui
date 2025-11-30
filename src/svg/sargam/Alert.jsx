/* eslint-disable max-len */

import React from 'react';

export default function Alert(props) {
  const {dark, onClick, onMouseDown, onMouseUp} = props;
  const color   = dark ? '#e0e0e0' : '#000000';
  const opacity = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(26) translate(-2.2 -2.2)'>
          <path d='M10.575 5.217 3.517 17a1.667 1.667 0 0 0 1.425 2.5h14.116a1.666 1.666 0 0 0 1.425-2.5L13.425 5.217a1.666 1.666 0 0 0-2.85 0Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <path d='M12 16h.008M12 10v3' stroke={color} strokeWidth='1.5' strokeMiterlimit='10' strokeLinecap='round' />
        </g>
      </g>
    </svg>
  );
}
