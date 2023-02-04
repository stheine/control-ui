import {connect}     from 'react-redux';
import Favicon       from 'react-favicon';
import React, {
  useEffect,
  useRef,
} from 'react';

import {Back}        from '../../svg/Back.jsx';
import faviconBase64 from '../../favicon.js';
import {Menu}        from '../../svg/Menu.jsx';
import {Next}        from '../../svg/Next.jsx';
import {Play}        from '../../svg/Play.jsx';
import {Stop}        from '../../svg/Stop.jsx';

// https://dev.to/jankapunkt/make-text-fit-it-s-parent-size-using-javascript-m40
const isOverflown = function({clientHeight, clientWidth, scrollHeight, scrollWidth}) {
  return scrollHeight > clientHeight || scrollWidth > clientWidth;
};
const resizeText = function({element, elements, minSize = 10, maxSize = 512, step = 1}) {
  for(const el of elements || [element]) {
    let size     = minSize;
    let overflow = false;

    const parent = el.parentNode;

    while (!overflow && size < maxSize) {
      el.style.fontSize = `${size}px`;
      overflow = isOverflown(parent);

      if (!overflow) {
        size += step;
      }
    }

    // revert to last state where no overflow happened
    el.style.fontSize = `${size - step}px`;
  }
};

const FitBox = function(props) {
  const {children} = props;

  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    resizeText({element});
  });

  return <div ref={ref} className='fit-box'>{children}</div>;
};

const Control = function(props) {
//  console.log('Control', {props});

//  console.log(document.querySelector('.fit-text'));
//  console.log({document});

//  useEffect(() => {
//    console.log('Control:useEffect, initial');
//  });
//
//  useEffect(() => {
//    console.log('Control:useEffect, all');
//  }, []);

  return (
    <div>
      <Favicon url={`data:image/png;base64,${faviconBase64}`} />
      <div className='control' id='control'>
        <div className='control__left'>
          <div className='control__action'>
            <FitBox>
              <Play />
            </FitBox>
          </div>
          <div className='control__action'>
            <FitBox>
              <img src='https://sochog.cl/wp-content/uploads/2018/06/objetivos-256x256.png' className='image' />
            </FitBox>
          </div>
          <div className='control__action'>
            <FitBox>
              Fit Me in here
            </FitBox>
          </div>
          <div className='control__action'>
            <FitBox>
              <Stop color='red' />
            </FitBox>
          </div>
          <div className='control__action'>
            <FitBox>
              This Text is pretty long and should be wrapped correctly into multiple lines.
            </FitBox>
          </div>
          <div className='control__action'>
            <FitBox>
              <Stop color='orange' />
            </FitBox>
          </div>
        </div>
        <div className='control__right'>
          <div className='control__navigation'>
            <FitBox>
              <Back />
            </FitBox>
          </div>
          <div className='control__navigation'>
            <FitBox>
              <Menu />
            </FitBox>
          </div>
          <div className='control__navigation'>
            <FitBox>
              <Next />
            </FitBox>
          </div>
        </div>
      </div>

    </div>
  );
};

const mapStateToProps = state => {
  const {settings} = state;

  return {settings};
};

export default connect(mapStateToProps)(Control);
