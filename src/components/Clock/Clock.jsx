import React from 'react';

export default function Clock() {
  const now = new Date();

  return (
    <div className='clock'>
      <div className='clock__time'>{now.getHours()}:{now.getMinutes()}</div>
      <div className='clock__date'>{now.getDay()}.{now.getMonth() + 1}.{now.getFullYear()}</div>
    </div>
  );
}
