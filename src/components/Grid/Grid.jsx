import _                    from 'lodash';
import {connect}            from 'react-redux';
import React                from 'react';
import {useNavigate}        from 'react-router';

import FitBox               from '../FitBox/FitBox.jsx';

import Down                 from '../../svg/sargam/Down.jsx';
import Home                 from '../../svg/sargam/Home.jsx';
import SettingsVerticalDots from '../../svg/sargam/SettingsVerticalDots.jsx';
import Up                   from '../../svg/sargam/Up.jsx';

const Grid = function(props) {
  const {items, maxPages, page, settings} = props;

  const navigate = useNavigate();

  // console.log('Grid', {maxPages, page, props});

  const renderActions = function() {
    return (
      <div key='grid' className='grid'>
        {_.map(items, (item, key) => {
          // console.log('Grid', {key, item});

          let className = `grid__action grid__item${key}`;

          if(item.width === 2) {
            className += ' double';
          } else if(item.width === 3) {
            className += ' triple';
          }

          return (
            <div key={key} className={className}>
              {item.fit ?
                (
                  <FitBox>
                    {item.content}
                  </FitBox>
                ) :
                item.content}
            </div>
          );
        })}
      </div>
    );
  };

  const renderNavigation = function() {
    return (
      <div key='navigation' className='navigation'>
        <div className='navigation__button one'>
          <Up
            dark={true}
            onClick={() => navigate(`${settings ? '/settings' : ''}/${page - 1 || maxPages}`)}
          />
        </div>
        {settings ?
          <div className='navigation__button two'>
            <Home dark={true} onClick={() => navigate('/1')} />
          </div> :
          [
            page !== 1 ?
              <div key='home' className='navigation__button two'>
                <Home dark={true} onClick={() => navigate('/1')} />
              </div> :
              null,
            <div key='settings' className='navigation__button three'>
              <SettingsVerticalDots dark={true} onClick={() => navigate('/settings/1')} />
            </div>,
          ]}
        <div className='navigation__button four'>
          <Down
            dark={true}
            onClick={() => navigate(`${settings ? '/settings' : ''}/${(page + 1) % maxPages || maxPages}`)}
          />
        </div>
      </div>
    );
  };

  return [
    renderActions(),
    renderNavigation(),
  ];
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Grid);
