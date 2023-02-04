import {connect}     from 'react-redux';
import Favicon       from 'react-favicon';
import React, {
//  useEffect,
//  useRef,
} from 'react';

import {Back}        from '../../svg/Back.jsx';
import faviconBase64 from '../../favicon.js';
import FitBox        from '../../components/FitBox.jsx';
import {Menu}        from '../../svg/Menu.jsx';
import {Next}        from '../../svg/Next.jsx';
import {Play}        from '../../svg/Play.jsx';
import Solar         from '../Solar/Solar.jsx';
import {Stop}        from '../../svg/Stop.jsx';
import Temperature   from '../Temperature/Temperature.jsx';

const Control = function(/* props */) {
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
              The quick brown fox jumps over the lazy dog
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
              <Solar />
            </FitBox>
          </div>
          <div className='control__action'>
            <FitBox>
              <Temperature />
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
