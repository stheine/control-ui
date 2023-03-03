/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color      = dark ? '#e0e0e0' : '#000000';
  const opacity    = dark ? '0.4'     : '0.16';

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g transform='scale(21.33)'>
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.11) translate(45 50)'>
            <path fill={color} d='M60,95.5c-19.575,0-35.5-15.926-35.5-35.5c0-19.575,15.925-35.5,35.5-35.5c13.62,0,25.467,7.714,31.418,19h22.627 C106.984,20.347,85.462,3.5,60,3.5C28.796,3.5,3.5,28.796,3.5,60c0,31.203,25.296,56.5,56.5,56.5 c16.264,0,30.911-6.882,41.221-17.88L85.889,84.255C79.406,91.168,70.201,95.5,60,95.5z' />
            <polygon fill={color} points='120,21.832 119.992,68.842 74.827,55.811' />
          </g>
        </g>
      </g>
    </svg>
  );
}
