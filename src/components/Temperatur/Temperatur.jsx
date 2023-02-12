import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const degreeRenderer = function(num, config) {
  const rounded = _.round(num, config.precision);
  const numString = rounded.toString();
  const [number, decimals] = numString.split('.');

  return (
    <div className='temperatur__value'>
      <div className='temperatur__value__number'>
        {number}
      </div>
      {decimals ?
        <div className='temperatur__value__dot'>
          .
        </div> :
        null}
      <div className='temperatur__value__right'>
        <div className='temperatur__value__unit'>
          {config.unit}
        </div>
        <div className='temperatur__value__decimals'>
          {decimals || <span>&nbsp;</span>}
        </div>
      </div>
    </div>
  );
};

const sites = {
  aussen: {
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

  return (
    <table className='temperatur'>
      <tbody>
        <tr>
          <td className='temperatur__label'>{sites[site].label}</td>
        </tr>
        {_.map(sites[site].values, value => (
          <tr key={value.key}>
            <td>
              {value.key === 'dummy' ?
                <span style={{fontSize: '10%'}}>&nbsp;</span> :
                degreeRenderer(_message?.[value.key], value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
