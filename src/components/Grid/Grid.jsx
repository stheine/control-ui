import _                    from 'lodash';
import {connect}            from 'react-redux';
import React                from 'react';
import {useNavigate}        from 'react-router';

import FitBox               from '../FitBox/FitBox.jsx';

import Down                 from '../../svg/sargam/Down.jsx';
import Home                 from '../../svg/sargam/Home.jsx';
import Light                from '../../svg/sargam/Light.jsx';
import SettingsVerticalDots from '../../svg/sargam/SettingsVerticalDots.jsx';
import Up                   from '../../svg/sargam/Up.jsx';

const Grid = function(props) {
  const {items, maxPages, page, route} = props;

  const navigate = useNavigate();

  // console.log('Grid', {maxPages, page, props});

  const renderActions = function() {
    return (
      <div key='grid' className='grid'>
        {_.map(items, (item, key) => {
          if(!item) {
            return;
          }

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
    let buttonTwo;
    let buttonThree;

    if(!route && page === 1) {
      buttonTwo   = <Light dark={true} onClick={() => navigate('/light/1')} />;
      buttonThree = <SettingsVerticalDots dark={true} onClick={() => navigate('/settings/1')} />;
    } else if(!route && page > 1) {
      buttonTwo   = <Home dark={true} onClick={() => navigate('/1')} />;
    } else if(route === 'settings') {
      buttonThree = <Home dark={true} onClick={() => navigate('/1')} />;
    } else {
      buttonTwo   = <Home dark={true} onClick={() => navigate('/1')} />;
    }

    return (
      <div key='navigation' className='navigation'>
        <div className='navigation__button one'>
          <Up
            dark={true}
            onClick={() => navigate(`${route ? `/${route}` : ''}/${page - 1 || maxPages}`)}
          />
        </div>
        <div className='navigation__button two'>
          {buttonTwo}
        </div>
        <div className='navigation__button three'>
          {buttonThree}
        </div>
        <div className='navigation__button four'>
          <Down
            dark={true}
            onClick={() => navigate(`${route ? `/${route}` : ''}/${(page + 1) % maxPages || maxPages}`)}
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
