import ms from 'ms';
import React, {
  useState,
} from 'react';

// https://stackoverflow.com/a/10797177
const repeatEvery = function(func, interval) {
  // Check current time and calculate the delay until next interval
  const now   = new Date();
  const delay = interval - (now % interval);

  const start = function() {
    // Execute function now...
    func();
      // ... and every interval
    setInterval(func, interval);
  };

  // Delay execution until it's an even interval
  setTimeout(start, delay);
};

export default function Clock() {
  const [_now, setNow] = useState(new Date());

  repeatEvery(() => setNow(new Date()), ms('4s')); // TODO 1m

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
