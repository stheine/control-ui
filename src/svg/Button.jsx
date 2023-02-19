/* eslint-disable max-len */

import React from 'react';

export default function Icon(props) {
  const {dark, onClick, pushed} = props;
  const color = dark ? '#e0e0e0' : '#000000';

  return (
    <svg viewBox='0 0 32 32'>
      <g onClick={onClick}>
        <path stroke={color} fill={color} d='M16,2C8.268,2,2,8.268,2,16s6.268,14,14,14s14-6.268,14-14S23.732,2,16,2z M16,29 C8.832,29,3,23.168,3,16S8.832,3,16,3s13,5.832,13,13S23.168,29,16,29z M16,4c-4.971,0-9,4.029-9,9v3c0,4.963,4.037,9,9,9 s9-4.037,9-9v-3C25,8.029,20.971,4,16,4z M16,5c4.411,0,8,3.589,8,8c0,4.411-3.589,8-8,8c-4.411,0-8-3.589-8-8 C8,8.589,11.589,5,16,5z M16,24c-3.95,0-7.232-2.88-7.877-6.649C9.657,20.122,12.608,22,16,22s6.343-1.878,7.877-4.649 C23.232,21.12,19.95,24,16,24z' />
        {pushed ? <circle fill={color} cx='16' cy='12.8' r='8' /> : null}
      </g>
    </svg>
  );
}
