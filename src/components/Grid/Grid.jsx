import {connect}            from 'react-redux';
import React                from 'react';
import {replace}            from 'redux-first-history';

import FitBox               from '../FitBox/FitBox.jsx';

import Down                 from '../../svg/sargam/Down.jsx';
import Home                 from '../../svg/sargam/Home.jsx';
import SettingsVerticalDots from '../../svg/sargam/SettingsVerticalDots.jsx';
import Up                   from '../../svg/sargam/Up.jsx';

const Page = function(props) {
  return [
    <div key='lo' className='grid__action'>
      <FitBox>
        {props.lo}
      </FitBox>
    </div>,
    <div key='mo' className='grid__action'>
      <FitBox>
        {props.mo}
      </FitBox>
    </div>,
    <div key='ro' className='grid__action'>
      <FitBox>
        {props.ro}
      </FitBox>
    </div>,
    <div key='lu' className='grid__action'>
      <FitBox>
        {props.lu}
      </FitBox>
    </div>,
    <div key='mu' className='grid__action'>
      <FitBox>
        {props.mu}
      </FitBox>
    </div>,
    <div key='ru' className='grid__action'>
      <FitBox>
        {props.ru}
      </FitBox>
    </div>,
  ];
};

const Grid = function(props) {
  const {dispatch, maxPages, page, settings} = props;

  // console.log('Grid', {maxPages, page, props});

  return [
    <div key='grid' className='grid'>
      <Page {...props} />
    </div>,
    <div key='navigation' className='navigation'>
      <div className='navigation__button'>
        <FitBox>
          <Up
            dark={true}
            onClick={() => dispatch(replace(`${settings ? '/settings' : ''}/${page - 1 || maxPages}`))}
          />
        </FitBox>
      </div>
      <div className='navigation__button'>
        <FitBox>
          {settings ?
            <Home dark={true} onClick={() => dispatch(replace('/1'))} /> :
            <SettingsVerticalDots dark={true} onClick={() => dispatch(replace('/settings/1'))} />}
        </FitBox>
      </div>
      <div className='navigation__button'>
        <FitBox>
          <Down
            dark={true}
            onClick={() => dispatch(replace(`${settings ? '/settings' : ''}/${(page + 1) % maxPages || maxPages}`))}
          />
        </FitBox>
      </div>
    </div>,
  ];
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Grid);
