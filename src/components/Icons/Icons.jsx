import _                      from 'lodash';
import React                  from 'react';

import FitBox                 from '../FitBox/FitBox.jsx';

import Back                   from '../../svg/Back.jsx';
import Forward                from '../../svg/Forward.jsx';
import Menu                   from '../../svg/Menu.jsx';
import PlayColored            from '../../svg/Play.jsx';
import StopColored            from '../../svg/Stop.jsx';

import Close                  from '../../svg/sargam/Close.jsx';
import Decrease               from '../../svg/sargam/Decrease.jsx';
import Down                   from '../../svg/sargam/Down.jsx';
import Home                   from '../../svg/sargam/Home.jsx';
import Icon                   from '../../svg/sargam/Icon.jsx';
import Increase               from '../../svg/sargam/Increase.jsx';
import Left                   from '../../svg/sargam/Left.jsx';
import Minus                  from '../../svg/sargam/Minus.jsx';
import Moon                   from '../../svg/sargam/Moon.jsx';
import Next                   from '../../svg/sargam/Next.jsx';
import Notification           from '../../svg/sargam/Notification.jsx';
import Off                    from '../../svg/sargam/Off.jsx';
import On                     from '../../svg/sargam/On.jsx';
import OnOff                  from '../../svg/sargam/OnOff.jsx';
import Pause                  from '../../svg/sargam/Pause.jsx';
import Play                   from '../../svg/sargam/Play.jsx';
import PlayPause              from '../../svg/sargam/PlayPause.jsx';
import Plus                   from '../../svg/sargam/Plus.jsx';
import Previous               from '../../svg/sargam/Previous.jsx';
import Refresh                from '../../svg/sargam/Refresh.jsx';
import Right                  from '../../svg/sargam/Right.jsx';
import SettingsApplications   from '../../svg/sargam/SettingsApplications.jsx';
import SettingsHorizontalDots from '../../svg/sargam/SettingsHorizontalDots.jsx';
import SettingsVerticalDots   from '../../svg/sargam/SettingsVerticalDots.jsx';
import Stop                   from '../../svg/sargam/Stop.jsx';
import Sun                    from '../../svg/sargam/Sun.jsx';
import Up                     from '../../svg/sargam/Up.jsx';

const row1 = [
  <Back key='back' />,
  <Menu key='menu' />,
  <PlayColored key='playColored' />,
  <StopColored key='stopColored' />,
  <StopColored key='stopColoredRed' color='red' />,
  <StopColored key='stopColoredOrange' color='orange' />,
  <Forward key='forward' />,
];
const row2 = [
  <Previous key='previous' dark={true} />,
  <Stop key='stop' dark={true} />,
  <Play key='play' dark={true} />,
  <Pause key='pause' dark={true} />,
  <PlayPause key='playPause' dark={true} />,
  <Next key='next' dark={true} />,
  <SettingsHorizontalDots key='settingsHorizontalDots' dark={true} />,
  <SettingsVerticalDots key='settingsVerticalDots' dark={true} />,
  <Off key='off' dark={true} />,
  <On key='on' dark={true} />,
];
const row3 = [
  <Down key='down' dark={true} />,
  <Up key='up' dark={true} />,
  <Left key='left' dark={true} />,
  <Right key='right' dark={true} />,
  <SettingsApplications key='settingsApplications' dark={true} />,
  <Minus key='minus' dark={true} />,
  <Plus key='plus' dark={true} />,
  <Increase key='Increase' dark={true} />,
  <Decrease key='decrease' dark={true} />,
  <Close key='close' dark={true} />,
];
const row4 = [
  <Icon key='icon' dark={true} />,
  <OnOff key='onOff' dark={true} />,
  <Sun key='sun' dark={true} />,
  <Moon key='moon' dark={true} />,
  <Notification key='notification' dark={true} />,
  <Refresh key='refresh' dark={true} />,
  <Home key='home' dark={true} />,
  <Increase key='Increase' dark={true} />,
  <Decrease key='decrease' dark={true} />,
  <Close key='close' dark={true} />,
];

export default function Icons() {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px'}}>
        {_.map(row1, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px'}}>
        {_.map(row2, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px'}}>
        {_.map(row3, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px', backgroundColor: '#000000'}}>
        {_.map(row2, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px', backgroundColor: '#000000'}}>
        {_.map(row3, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px', backgroundColor: '#000000'}}>
        {_.map(row4, icon => <FitBox>{icon}</FitBox>)}
      </div>
    </div>
  );
}
