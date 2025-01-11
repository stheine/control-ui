import _           from 'lodash';
import classNames  from 'classnames';
import ms          from 'ms';
import React, {
  useContext,
  useState,
} from 'react';

import Alert       from '../../svg/sargam/Alert.jsx';
import AppContext  from '../../contexts/AppContext.js';
import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

const renderValue = function(value, config) {
  const rounded = _.round(value, config.precision);
  const valueString = rounded.toString();
  const [number, decimals] = valueString.split('.');

  return (
    <div className='temperatur__value'>
      <div className={classNames(['temperatur__value__number', config.className])}>
        {number}
      </div>
      <div className='temperatur__value__right'>
        <div className='temperatur__value__unit'>
          {config.unit}
        </div>
        {decimals ?
          <div className='temperatur__value__right__bottom'>
            <div className='temperatur__value__dot'>.</div>
            <div className='temperatur__value__decimals'>{decimals}</div>
          </div> :
          null}
      </div>
    </div>
  );
};

const renderWarningTitle = function(warning) {
  return _.map(_.toLower(warning.event).split(' '), word => _.upperFirst(word)).join(' ');
};

export default function Temperatur(props) {
  const {site} = props;
  // console.log('Temperaturen');

  const {setAppDialog} = useContext(AppContext);
  const {messages} = useContext(MqttContext);

  const [_lastTime, setLastTime] = useState();

  const siteConfig = _.find(mqttConfig, {label: site});

  if(!siteConfig) {
    return <div>Missing: {site}</div>;
  }

  const message = messages[siteConfig.topic];

  if(message && site === 'Außen' && message.Time !== _lastTime) {
    setLastTime(message.Time);
    // console.log(site, message);
  }

  let warnungen;

  if(site === 'Außen') {
    const messageDwd = messages['wetter/dwd/INFO'];

    warnungen = messageDwd ? messageDwd?.forecast.warnings || [] : [{event: 'none'}];
  }

  const now = Date.now();

  if(message?.Time && now - Date.parse(message.Time) > ms('60m')) {
    // eslint-disable-next-line no-console
    console.log('Temperatur:outdated', {message, now, parsedTime: Date.parse(message.Time), stringTime: message.Time});

    return `Outdated`;
  }

  return (
    <div
      className='temperaturDiv'
      onClick={() => setAppDialog({content: 'Wetter', header: 'Wetter', timeout: '30s'})}
    >
      <table className='temperatur'>
        <tbody>
          <tr>
            <td className='temperatur__label'>{siteConfig.label}</td>
          </tr>
          {_.map(siteConfig.values, config => (
            <tr key={config.key}>
              <td>
                <div className='temperatur__content'>
                  {config.key === 'dummy' ?
                    <span style={{fontSize: '10%'}}>&nbsp;</span> :
                    renderValue(_.get(message, config.key), config)}
                </div>
              </td>
            </tr>
          ))}
          {warnungen?.length ?
            <tr key='warnung'>
              <td colSpan={2} className='temperatur__warning'>
                <div
                  className='temperatur__warning__text'
                >
                  {_.map(_.uniqBy(warnungen, 'event'), warnung => renderWarningTitle(warnung)).join(', ')}
                </div>
                <div className='temperatur__warning__icon'>
                  <Alert dark={true} />
                </div>
              </td>
            </tr> :
            null}
        </tbody>
      </table>
    </div>
  );
}
