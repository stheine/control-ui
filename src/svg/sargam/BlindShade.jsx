import React from 'react';

export default function Icon(props) {
  const {dark, onClick, onMouseDown, onMouseUp} = props;
  const color     = dark ? '#e0e0e0' : '#000000';
  const fillColor = dark ? '#000000' : '#e0e0e0';

  return (
    <svg viewBox='0 -40 440 480'>
      <g onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <rect id='handleOnClickOnUnfilledArea' pointerEvents='all' x='0' y='0' width='100%' height='100%' fill='none' />
        <g stroke={color} strokeWidth='14' strokeLinejoin='round' fill={fillColor}>
          <rect x='38' y='23' width='362' height='20' fill={color} />
          <rect x='69' y='340' width='300' height='60' fill='none' strokeWidth='10' />
          <g strokeWidth='7'>
            <g strokeLinejoin='miter'>
              <polyline points='52,50  32,83  406,83  386,50 ' />
              <polyline points='52,90  32,123 406,123 386,90 ' />
              <polyline points='52,130 32,163 406,163 386,130' />
              <polyline points='52,170 32,203 406,203 386,170' />
              <polyline points='52,210 32,243 406,243 386,210' />
              <polyline points='52,250 32,283 406,283 386,250' />
              <polyline points='52,290 32,323 406,323 386,290' />
            </g>
            <polyline points='  52,330 32,363 406,363 386,330' />
          </g>
        </g>
      </g>
    </svg>
  );
}
