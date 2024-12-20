import ms from 'ms';
import React, {
  useEffect,
  useState,
} from 'react';

import repeatEvery from './repeatEvery.js';

let refreshInterval;

export default function Clock() {
  const [_now, setNow] = useState(new Date());

  useEffect(() => {
    // console.log('Clock:useEffect, mount');

    refreshInterval = repeatEvery(() => {
      // console.log('Clock, refresh');

      setNow(new Date());
    }, ms('1m'), 'Clock');

    return () => {
      // console.log('Clock:useEffect, dismount', {refreshInterval});

      if(refreshInterval) {
        // console.log('Clock, remove, disable refresh');
        clearInterval(refreshInterval);

        refreshInterval = null;
      }
    };
  }, []);

  return (
    <div className='clock'>
      <div className='clock__time'>
        {_now.toLocaleTimeString('de-DE', {timeStyle: 'short'}).replace(/^0/, '')}
      </div>
      <div className='clock__date'>
        <div className='clock__date__day'>
          {_now.toLocaleDateString('de-DE', {weekday: 'short'})}
        </div>
        <div className='clock__date__date'>
          {_now.toLocaleDateString('de-DE')}
        </div>
      </div>
    </div>
  );
}
