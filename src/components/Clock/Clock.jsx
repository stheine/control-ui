import ms from 'ms';
import React, {
  useEffect,
  useState,
} from 'react';

let refreshInterval;

export default function Clock() {
  const [_now, setNow] = useState(new Date());

  const repeatEvery = function(func, interval) {
    // https://stackoverflow.com/a/10797177
    // Check current time and calculate the delay until next interval
    const now   = new Date();
    const delay = interval - (now % interval);

    const start = function() {
      // Execute function now...
      func();

      // console.log('Clock, start refresh interval');

      // ... and every interval
      refreshInterval = setInterval(func, interval);
    };

    if(refreshInterval) {
      // console.log('Clock, start, disable refresh');
      clearInterval(refreshInterval);

      refreshInterval = null;
    }

    // Delay execution until it's an even interval
    setTimeout(start, delay);
  };

  useEffect(() => {
    // console.log('Clock:useEffect, mount');

    repeatEvery(() => {
      // console.log('Clock, refresh');

      setNow(new Date());
    }, ms('1m'));

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
        {_now.toLocaleTimeString('de-DE', {timeStyle: 'short'})}
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
