import React                  from 'react';

import FitBox                 from '../FitBox.jsx';

import Back                   from '../../svg/Back.jsx';
import Forward                from '../../svg/Forward.jsx';
import Menu                   from '../../svg/Menu.jsx';
import PlayColored            from '../../svg/Play.jsx';
import StopColored            from '../../svg/Stop.jsx';

import Close                  from '../../svg/sargam/Close.jsx';
import Decrease               from '../../svg/sargam/Decrease.jsx';
import Down                   from '../../svg/sargam/Down.jsx';
import Increase               from '../../svg/sargam/Increase.jsx';
import Left                   from '../../svg/sargam/Left.jsx';
import Minus                  from '../../svg/sargam/Minus.jsx';
import Next                   from '../../svg/sargam/Next.jsx';
import Off                    from '../../svg/sargam/Off.jsx';
import On                     from '../../svg/sargam/On.jsx';
import Pause                  from '../../svg/sargam/Pause.jsx';
import Play                   from '../../svg/sargam/Play.jsx';
import PlayPause              from '../../svg/sargam/PlayPause.jsx';
import Plus                   from '../../svg/sargam/Plus.jsx';
import Previous               from '../../svg/sargam/Previous.jsx';
import Right                  from '../../svg/sargam/Right.jsx';
import SettingsApplications   from '../../svg/sargam/SettingsApplications.jsx';
import SettingsHorizontalDots from '../../svg/sargam/SettingsHorizontalDots.jsx';
import SettingsVerticalDots   from '../../svg/sargam/SettingsVerticalDots.jsx';
import Stop                   from '../../svg/sargam/Stop.jsx';
import Up                     from '../../svg/sargam/Up.jsx';

export default function Icons() {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px'}}>
        <FitBox><Back /></FitBox>
        <FitBox><Menu /></FitBox>
        <FitBox><PlayColored /></FitBox>
        <FitBox><StopColored /></FitBox>
        <FitBox><StopColored color='red' /></FitBox>
        <FitBox><StopColored color='orange' /></FitBox>
        <FitBox><Forward /></FitBox>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px'}}>
        <FitBox><Down /></FitBox>
        <FitBox><Up /></FitBox>
        <FitBox><Left /></FitBox>
        <FitBox><Right /></FitBox>
        <FitBox><SettingsApplications /></FitBox>
        <FitBox><Minus /></FitBox>
        <FitBox><Plus /></FitBox>
        <FitBox><Increase /></FitBox>
        <FitBox><Decrease /></FitBox>
        <FitBox><Close /></FitBox>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px'}}>
        <FitBox><Previous /></FitBox>
        <FitBox><Stop /></FitBox>
        <FitBox><Play /></FitBox>
        <FitBox><Pause /></FitBox>
        <FitBox><PlayPause /></FitBox>
        <FitBox><Next /></FitBox>
        <FitBox><SettingsHorizontalDots /></FitBox>
        <FitBox><SettingsVerticalDots /></FitBox>
        <FitBox><Off /></FitBox>
        <FitBox><On /></FitBox>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px', backgroundColor: '#000000'}}>
        <FitBox><Down dark={true} /></FitBox>
        <FitBox><Up dark={true} /></FitBox>
        <FitBox><Left dark={true} /></FitBox>
        <FitBox><Right dark={true} /></FitBox>
        <FitBox><SettingsApplications dark={true} /></FitBox>
        <FitBox><Minus dark={true} /></FitBox>
        <FitBox><Plus dark={true} /></FitBox>
        <FitBox><Increase dark={true} /></FitBox>
        <FitBox><Decrease dark={true} /></FitBox>
        <FitBox><Close dark={true} /></FitBox>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', height: '100px', backgroundColor: '#000000'}}>
        <FitBox><Previous dark={true} /></FitBox>
        <FitBox><Stop dark={true} /></FitBox>
        <FitBox><Play dark={true} /></FitBox>
        <FitBox><Pause dark={true} /></FitBox>
        <FitBox><PlayPause dark={true} /></FitBox>
        <FitBox><Next dark={true} /></FitBox>
        <FitBox><SettingsHorizontalDots dark={true} /></FitBox>
        <FitBox><SettingsVerticalDots dark={true} /></FitBox>
        <FitBox><Off dark={true} /></FitBox>
        <FitBox><On dark={true} /></FitBox>
      </div>
    </div>
  );
}
