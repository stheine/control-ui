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
          <path d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' fill={color} fillOpacity={opacity} stroke={color} strokeWidth='1.5' strokeMiterlimit='10' />
          <g transform='scale(0.01) translate(600 600)'>
            <path fill={color} strokeWidth='1.5' strokeMiterlimit='10' strokeLinecap='round' d='M513.94,0v693.97H686.06V0H513.94z M175.708,175.708 C67.129,284.287,0,434.314,0,600c0,331.371,268.629,600,600,600s600-268.629,600-600c0-165.686-67.13-315.713-175.708-424.292 l-120.85,120.85C981.102,374.216,1029.126,481.51,1029.126,600c0,236.981-192.146,429.126-429.126,429.126 c-236.981,0-429.126-192.145-429.126-429.126c0-118.49,48.025-225.784,125.684-303.442L175.708,175.708z' />
          </g>
        </g>
      </g>
    </svg>
  );
}
