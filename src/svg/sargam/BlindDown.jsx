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
          <rect x='69' y='340' width='300' height='60' fill='none' strokeWidth='10' />
          <g strokeWidth='7'>
            <g strokeLinejoin='miter'>
              <polyline points='52,50  52,83  386,83  386,50 ' />
              <polyline points='52,90  52,123 386,123 386,90 ' />
              <polyline points='52,130 52,163 386,163 386,130' />
              <polyline points='52,170 52,203 386,203 386,170' />
              <polyline points='52,210 52,243 386,243 386,210' />
              <polyline points='52,250 52,283 386,283 386,250' />
              <polyline points='52,290 52,323 386,323 386,290' />
            </g>
            <polyline points='52,330 52,363 386,363 386,330' />
          </g>
        </g>
      </g>
    </svg>
  );
}
