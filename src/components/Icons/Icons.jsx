import _                      from 'lodash';
import React                  from 'react';

import FitBox                 from '../FitBox/FitBox.jsx';

import Back                   from '../../svg/Back.jsx';
import Forward                from '../../svg/Forward.jsx';
import Menu                   from '../../svg/Menu.jsx';
import PlayColored            from '../../svg/Play.jsx';
import StopColored            from '../../svg/Stop.jsx';

import Button                 from '../../svg/Button.jsx';
import Checked                from '../../svg/sargam/Checked.jsx';
import Close                  from '../../svg/sargam/Close.jsx';
import BlindDown              from '../../svg/sargam/BlindDown.jsx';
import BlindShade             from '../../svg/sargam/BlindShade.jsx';
import BlindUp                from '../../svg/sargam/BlindUp.jsx';
import Decrease               from '../../svg/sargam/Decrease.jsx';
import Down                   from '../../svg/sargam/Down.jsx';
import Home                   from '../../svg/sargam/Home.jsx';
import Icon                   from '../../svg/sargam/Icon.jsx';
import Increase               from '../../svg/sargam/Increase.jsx';
import Led                    from '../../svg/Led.jsx';
import Left                   from '../../svg/sargam/Left.jsx';
import Minus                  from '../../svg/sargam/Minus.jsx';
import Moon                   from '../../svg/sargam/Moon.jsx';
import Next                   from '../../svg/sargam/Next.jsx';
import Notification           from '../../svg/sargam/Notification.jsx';
import OffChecked             from '../../svg/sargam/OffChecked.jsx';
import OffColored             from '../../svg/sargam/OffColored.jsx';
import OnChecked              from '../../svg/sargam/OnChecked.jsx';
import OnColored              from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown           from '../../svg/sargam/OnOffUnknown.jsx';
import Pause                  from '../../svg/sargam/Pause.jsx';
import Play                   from '../../svg/sargam/Play.jsx';
import PlayPause              from '../../svg/sargam/PlayPause.jsx';
import Plus                   from '../../svg/sargam/Plus.jsx';
import Power                  from '../../svg/sargam/Power.jsx';
import Previous               from '../../svg/sargam/Previous.jsx';
import Refresh                from '../../svg/sargam/Refresh.jsx';
import Right                  from '../../svg/sargam/Right.jsx';
import ScreenOff              from '../../svg/sargam/ScreenOff.jsx';
import SettingsApplications   from '../../svg/sargam/SettingsApplications.jsx';
import SettingsHorizontalDots from '../../svg/sargam/SettingsHorizontalDots.jsx';
import SettingsVerticalDots   from '../../svg/sargam/SettingsVerticalDots.jsx';
import Stop                   from '../../svg/sargam/Stop.jsx';
import StopCircle             from '../../svg/sargam/StopCircle.jsx';
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
  <Previous key='previous' />,
  <Stop key='stop' />,
  <Play key='play' />,
  <Pause key='pause' />,
  <PlayPause key='playPause' />,
  <Next key='next' />,
  <SettingsApplications key='settingsApplications' />,
  <SettingsHorizontalDots key='settingsHorizontalDots' />,
  <SettingsVerticalDots key='settingsVerticalDots' />,
  <Led key='ledRed' color='red' />,
  <Led key='ledRedLit' color='red' lit={true} />,
  <Led key='ledGreen' color='green' />,
  <Led key='ledGreen' color='green' lit={true} />,
  <Led key='ledBlue' color='blue' />,
  <Led key='ledBlue' color='blue' lit={true} />,
  <Led key='ledYello' color='yellow' />,
  <Led key='ledYello' color='yellow' lit={true} />,
  <Led key='ledWhite' color='white' />,
  <Led key='ledWhite' color='white' lit={true} />,
];
const row3 = [
  <Down key='down' />,
  <Up key='up' />,
  <Left key='left' />,
  <Right key='right' />,
  <Minus key='minus' />,
  <Plus key='plus' />,
  <Increase key='increase' />,
  <Decrease key='decrease' />,
  <Icon key='icon' />,
  <Close key='close' />,
  <Checked key='checked' />,
  <BlindDown key='blindDown' />,
  <BlindShade key='blindShade' />,
  <BlindUp key='blindUp' />,
  <StopCircle key='stopCircle' />,
];
const row4 = [
  <Sun key='sun' />,
  <Moon key='moon' />,
  <Notification key='notification' />,
  <Refresh key='refresh' />,
  <Home key='home' />,
  <ScreenOff key='screenOff' />,
  <OffChecked key='off' />,
  <OnChecked key='on' />,
  <OffColored key='off' />,
  <OnColored key='on' />,
  <OnOffUnknown key='on' />,
  <Button key='button' />,
  <Button key='buttonPushed' pushed={true} />,
  <Power key='power' />,
];

export default function Icons() {
  return (
    <div className='icons'>
      <div className='icons__row'>
        {_.map(row1, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div className='icons__row'>
        {_.map(row2, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div className='icons__row'>
        {_.map(row3, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div className='icons__row'>
        {_.map(row4, icon => <FitBox>{icon}</FitBox>)}
      </div>
      <div className='icons__row dark'>
        {_.map(row2, icon => <FitBox>{React.cloneElement(icon, {dark: true})}</FitBox>)}
      </div>
      <div className='icons__row dark'>
        {_.map(row3, icon => <FitBox>{React.cloneElement(icon, {dark: true})}</FitBox>)}
      </div>
      <div className='icons__row dark'>
        {_.map(row4, icon => <FitBox>{React.cloneElement(icon, {dark: true})}</FitBox>)}
      </div>
    </div>
  );
}
