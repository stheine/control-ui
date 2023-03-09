import _                 from 'lodash';
import ms                from 'ms';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

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

const sites = {
  aussen: {
    label: 'Außen',
    topic: 'tasmota/thermometer/tele/SENSOR',
    values: [{
      key:       'AM2301.Temperature',
      precision: 1,
      unit:      '°C',
    }, {
      key:       'AM2301.Humidity',
      precision: 0,
      unit:      '%rH',
    }],
  },
  aussenVito: {
    label: 'Außen',
    topic: 'vito/tele/SENSOR',
    values: [{
      key:       'tempAussen',
      precision: 1,
      unit:      '°C',
    }],
  },
  buero: {
    label: 'Büro',
    topic: 'Zigbee/LuftSensor Büro',
    values: [{
      key:       'temperature',
      precision: 1,
      unit:      '°C',
    }, {
      key:       'humidity',
      precision: 0,
      unit:      '%rH',
    }],
  },
  wohnen: {
    label: 'Wohnen',
    topic: 'Wohnzimmer/tele/SENSOR',
    values: [{
      key:       'temperature',
      precision: 1,
      unit:      '°C',
    }, {
      key:       'humidity',
      precision: 0,
      unit:      '%rH',
    }],
  },
};

export default function Temperatur(props) {
  const {site} = props;
  // console.log('Temperaturen');

  const mqttClient = useContext(MqttClientContext);

  const [_message, setMessage] = useState();

  useEffect(() => mqttSubscribe({mqttClient, topic: sites[site].topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient, site]);

  if(_message) {
    // console.log({site, _message});
  }

  if(_message?.Time && Date.now() - Date.parse(_message.Time) > ms('60m')) {
    // eslint-disable-next-line no-console
    console.log('Temperatur:outdated', {now: Date.now(), sent: Date.parse(_message.Time), string: _message.Time});

    return `Outdated`;
  }

  return (
    <table className='temperatur'>
      <tbody>
        <tr>
          <td className='temperatur__label'>{sites[site].label}</td>
        </tr>
        {_.map(sites[site].values, config => (
          <tr key={config.key}>
            <td>
              <div className='temperatur__content'>
                {config.key === 'dummy' ?
                  <span style={{fontSize: '10%'}}>&nbsp;</span> :
                  renderValue(_.get(_message, config.key), config)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
