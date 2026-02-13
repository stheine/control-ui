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
          <g transform='scale(0.45) translate(10 10)'>
            <path stroke={color} fill={color} d='M15.989 9.75c1.909-0.042 3.465-1.497 3.666-3.358l0.001-0.017c0-1.277-2.174-3.836-3.109-4.876-0.138-0.153-0.336-0.249-0.558-0.249h-0.001c-0.222 0-0.421 0.097-0.558 0.25l-0.001 0.001c-0.928 1.040-3.086 3.598-3.086 4.874 0.196 1.873 1.744 3.328 3.641 3.375l0.005 0zM15.991 3.145c0.878 0.916 1.605 1.985 2.136 3.161l0.029 0.071c-0.204 1.042-1.087 1.825-2.162 1.873l-0.005 0c-1.078-0.039-1.961-0.828-2.143-1.859l-0.002-0.014c0.555-1.247 1.276-2.316 2.152-3.237l-0.005 0.005zM21 11.25h-10c-0.414 0-0.75 0.336-0.75 0.75v0 18c0 0.414 0.336 0.75 0.75 0.75h10c0.414-0 0.75-0.336 0.75-0.75v0-18c-0-0.414-0.336-0.75-0.75-0.75v0zM20.25 29.25h-8.5v-16.5h2.5v3.987c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-3.987h4.5z' />
          </g>
        </g>
      </g>
    </svg>
  );
}
