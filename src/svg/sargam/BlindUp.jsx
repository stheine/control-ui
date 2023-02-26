import React from 'react';

export default function Icon(props) {
  const {dark, onClick} = props;
  const color     = dark ? '#e0e0e0' : '#000000';
  const fillColor = dark ? '#000000' : '#e0e0e0';

  return (
    <svg viewBox='0 -40 440 480'>
      <g onClick={onClick}>
        <g stroke={color} strokeWidth='14' strokeLinejoin='round' fill={fillColor}>
          <rect x='38' y='23' width='362' height='20' fill={color} />
          <rect x='69' y='120' width='300' height='280' fill='none' strokeWidth='10' />
          <g strokeWidth='7'>
            <g strokeLinejoin='miter'>
              <polyline points='52,50  52,63  386,63  386,50 ' />
              <polyline points='52,70  52,83  386,83  386,70 ' />
              <polyline points='52,90  52,103 386,103 386,90 ' />
            </g>
            <polyline points='  52,110 52,123 386,123 386,110' />
          </g>
        </g>
      </g>
    </svg>
  );
}
