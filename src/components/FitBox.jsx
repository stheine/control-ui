import React, {
  useEffect,
  useRef,
} from 'react';

// https://dev.to/jankapunkt/make-text-fit-it-s-parent-size-using-javascript-m40
const isOverflown = function({clientHeight, clientWidth, scrollHeight, scrollWidth}, debug) {
  const overflown = scrollHeight > clientHeight ||
    (scrollWidth !== clientWidth && scrollWidth > clientWidth * 0.8);

  if(debug) {
    // eslint-disable-next-line no-console
    console.log('isOverflown()', {clientHeight, clientWidth, scrollHeight, scrollWidth, overflown});
  }

  return overflown;
};
const resizeText = function({debug, element, elements, minSize = 10, maxSize = 512, step = 1}) {
  for(const el of elements || [element]) {
    let size     = minSize;
    let overflow = false;

    const parent = el.parentNode;

    while(!overflow && size < maxSize) {
      el.style.fontSize = `${size}px`;
      overflow = isOverflown(parent, debug);

      if(!overflow) {
        size += step;
      }

      if(debug) {
        // eslint-disable-next-line no-console
        console.log('resizeText()', {size, parent});
      }
    }

    // revert to last state where no overflow happened
    el.style.fontSize = `${size - step}px`;
  }
};

export default function FitBox(props) {
  const {children, debug} = props;

  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    if(debug) {
      // eslint-disable-next-line no-console
      console.log('FitBox:useEffect', {element, children});
    }

    resizeText({debug, element});
  });

  if(debug) {
    // eslint-disable-next-line no-console
    console.log('FitBox:render', children);
  }

  return <div ref={ref} className='fit-box'>{children}</div>;
}
