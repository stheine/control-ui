import _           from 'lodash';
import ms          from 'ms';
import React, {
  useContext,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

const renderValue = function(value, config) {
  const rounded = _.round(value, config.precision);
  const valueString = rounded.toString();
  const [number, decimals] = valueString.split('.');

  return (
    <div className='temperatur__value'>
      <div className='temperatur__value__number'>
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

export default function Temperatur(props) {
  const {site} = props;
  // console.log('Temperaturen');

  const {messages} = useContext(MqttContext);

  const siteConfig = _.find(mqttConfig, {label: site});

  if(!siteConfig) {
    return <div>Missing: {site}</div>;
  }

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log({site, message});
  }

  if(message?.Time && Date.now() - Date.parse(message.Time) > ms('60m')) {
    // eslint-disable-next-line no-console
    console.log('Temperatur:outdated', {now: Date.now(), sent: Date.parse(message.Time), string: message.Time});

    return `Outdated`;
  }

  return (
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
      </tbody>
    </table>
  );
}
