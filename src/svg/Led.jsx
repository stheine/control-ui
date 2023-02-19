/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {color, dark, lit, onClick} = props;
  let   color1;                                // led color light
  let   color2;                                // led color dark
  const color3 = dark ? '#f0f0f0' : '#303030'; // border
  const color4 = dark ? '#303030' : '#d0cfce'; // fill

  switch(color) {
    case 'blue': // hue 201
      color1 = lit ? '#169fe9' : '#92d3f5';
      color2 = '#61b2e4';
      break;

    case 'green': // hue 105
      color1 = lit ? '#4be916' : '#acf594';
      color2 = '#83e462';
      break;

    case 'red': // hue 0
      color1 = lit ? '#e91616' : '#f59494';
      color2 = '#e46262';
      break;

    case 'yellow': // hue 60
      color1 = lit ? '#e9e916' : '#f5f594';
      color2 = '#e4e462';
      break;

    case 'white':
    default:
      color1 = lit ? '#ffffff' : '#d9d9d9';
      color2 = lit ? '#e0e0e0' : '#bfbfbf';
      break;
  }

  return (
    <svg viewBox='0 0 72 72'>
      <g onClick={onClick}>
        <g strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' strokeWidth='2'>
          <path fill={color1} d='M31.3882,26.7177c0,0,9.2367-1.8188,8.4221-9.1964c-1.3538-12.261-1.4678-10.4237-1.4678-10.4237 l-5.5293,1.0104C32.8133,8.1081,35.9998,21.7018,31.3882,26.7177z' />
          <path fill={color1} d='M34.5417,7.0359c-8.1462,0-14.75,7.496-14.75,16.7427v16.388h29.5' />
          <rect fill={color4} x='26.8333' y='44.5' width='4' height='22.095' />
          <rect fill={color4} x='41.3333' y='44.5' width='4' height='16.4792' />
          <path fill={color2} d='M34.5417,7.5625c0,0,15.3232,0.5495,15.9047,13.875c0.9664,22.1458,0.0665,18.9191,0.0665,18.9191 l-9.3254-0.19C41.1875,40.1667,42.6247,15.125,34.5417,7.5625z' />
          <rect fill={color2} x='43.3333' y='40.7917' width='11.8333' height='3.0833' />
          <rect fill={color1} x='16.3353' y='40.7917' width='26.998' height='3.0833' />
          <path fill='none' stroke={color3} d='M34.5417,7.0359c-8.1462,0-14.75,7.496-14.75,16.7427v16.388h29.5' />
          <rect fill='none' stroke={color3} x='26.8333' y='44.5' width='4' height='22.095' />
          <rect fill='none' stroke={color3} x='41.3333' y='44.5' width='4' height='16.4792' />
          <path fill='none' stroke={color3} d='M25.8125,19.0625' />
          <path fill='none' stroke={color3} d='M35.2497,7.0359c8.1462,0,14.75,7.496,14.75,16.7427v7.388' />
          <polygon fill='none' stroke={color3} points='16,44.5 45.5309,44.5 45.9063,44.5 56,44.5 56,40.1667 45.9063,40.1667 45.4999,40.1667 16,40.1667' />
        </g>
      </g>
    </svg>
  );
}
