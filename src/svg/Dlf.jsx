/* eslint-disable max-len */

import React from 'react';

export default function Dlf(props) {
  const {onClick} = props;

  return (
    <svg viewBox='0 0 512 512'>
      <g onClick={onClick}>
        <g transform='scale(21.33)'>
          <path fill='#198aff' stroke='#198aff' strokeWidth='1.5' strokeMiterlimit='10' d='M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z' />
        </g>
        <g transform='scale(5.12)'>
          <path d='M 82.002,44.304 H 22.003 V 57.208 H 82.002 Z M 22.003,37.785 H 76.344 V 29.47 H 22.003 Z m 0,-14.228 H 61.46 V 18.005 H 22.003 Z M 72.545,63.731 H 21.999 v 7.61 H 72.545 Z M 61.457,82.005 H 21.999 V 77.25 h 39.458 z' fill='#ffffff' />
        </g>
      </g>
    </svg>
  );
}
