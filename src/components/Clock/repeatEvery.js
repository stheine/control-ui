const refreshIntervals = {};

export default function repeatEvery(func, interval, name) {
  // https://stackoverflow.com/a/10797177
  // Check current time and calculate the delay until next interval
  const now   = new Date();
  const delay = interval - (now % interval);

  const start = function() {
    // Execute function now...
    func();

    // console.log('Clock, start refresh interval');

    // ... and every interval
    refreshIntervals[name] = setInterval(func, interval);
  };

  if(refreshIntervals[name]) {
    // console.log('Clock, start, disable refresh');
    clearInterval(refreshIntervals[name]);

    refreshIntervals[name] = null;
  }

  // Delay execution until it's an even interval
  setTimeout(start, delay);

  return refreshIntervals[name];
}
