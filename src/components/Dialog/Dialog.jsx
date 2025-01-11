import React         from 'react';

import AutoLaden     from '../AutoLaden/AutoLaden.jsx';
import Close         from '../../svg/sargam/Close.jsx';
import SolarForecast from '../SolarForecast/SolarForecast.jsx';
import Strompreise   from '../Strompreise/Strompreise.jsx';
import VolumioDialog from '../VolumioDialog/VolumioDialog.jsx';
import Wetter        from '../Wetter/Wetter.jsx';

export default function Dialog(props) {
  const {content, header, onClose} = props;

  let renderContent;

  switch(content) {
    case 'AutoLaden':
      renderContent = <AutoLaden />;
      break;

    case 'SolarForecast':
      renderContent = <SolarForecast />;
      break;

    case 'Strompreise':
      renderContent = <Strompreise />;
      break;

    case 'VolumioDialog':
      renderContent = <VolumioDialog />;
      break;

    case 'Wetter':
      renderContent = <Wetter />;
      break;

    default:
      renderContent = content;
      break;
  }

  return (
    <div className='dialog-layer'>
      <div className='dialog-layer__center'>
        <div className='dialog-layer__center__border'>
          <div className='dialog-layer__center__border__header'>
            <div className='dialog-layer__center__border__header__text'>{header || 'Information'}</div>
            <div className='dialog-layer__center__border__header__blank' />
            <div className='dialog-layer__center__border__header__closer' onClick={onClose}><Close /></div>
          </div>
          <div className='dialog-layer__center__border__content'>{renderContent}</div>
        </div>
      </div>
    </div>
  );
}
