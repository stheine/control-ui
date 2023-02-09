import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const sites = {
  aussen: {
    label: 'Aussen',
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

export default function Temperaturen(props) {
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
    <table>
      <tbody>
        <tr>
          <td>{sites[site].label}</td>
        </tr>
        {_.map(sites[site].values, value => (
          <tr key={value.key}>
            <td>{_.round(_message?.[value.key], value.precision)}&nbsp;{value.unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
