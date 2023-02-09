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
const resizeText = function({debug, element, elements, minSize = 10, maxSize = 100, step = 10}) {
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
    const fontSize = size - step;

    el.style.fontSize = `${fontSize}px`;
  }
};

export default function FitBox(props) {
  const {border, children, debug} = props;

  // console.log('FitBox', {props});

  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    if(debug) {
      // eslint-disable-next-line no-console
      console.log('FitBox:useEffect', {element, children});
    }

    resizeText({children, debug, element});
  });

  if(debug) {
    // eslint-disable-next-line no-console
    console.log('FitBox:render', children);
  }

  const style = {};

  if(border) {
    style.border = '1px solid #000000';
  }

  return <div ref={ref} className='fit-box' style={style}>{children}</div>;
}
