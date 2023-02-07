import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topics = [
  'vito/tele/SENSOR',
  'Wohnzimmer/tele/SENSOR',
];

// eslint-disable-next-line no-underscore-dangle
const _messages   = {};
const setMessages = {};

export default function Temperaturen() {
  // console.log('Temperaturen');

  for(const topic of topics) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_message, setMessage] = useState();

    _messages[topic]   = _message;
    setMessages[topic] = setMessage;
  }

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => {
    // console.log('Solar:useEffect, mqttClient');

    const cleanups = {};

    for(const topic of topics) {
      // eslint-disable-next-line object-property-newline
      const cleanup = mqttSubscribe({mqttClient, topic, setMessage: message =>
        setMessages[topic](message)});

      if(cleanup) {
        cleanups[topic] = cleanup;
      }
    }

    return () => {
      for(const topic of topics) {
        if(cleanups[topic]) {
          cleanups[topic]();
        }
      }
    };
  }, [mqttClient]);

  // console.log(_messages);

  const tempAussen = _messages?.['vito/tele/SENSOR']?.tempAussen;
  const tempInnen  = _messages?.['Wohnzimmer/tele/SENSOR']?.temperature;
  const luftfeuchtigkeit  = _messages?.['Wohnzimmer/tele/SENSOR']?.humidity;

  return (
    <table>
      <tbody>
        <tr>
          <td>Aussen:</td>
          <td>{_.round(tempAussen, 1)}&nbsp;°C</td>
        </tr>
        <tr>
          <td>Innen:</td>
          <td>{_.round(tempInnen, 1)}&nbsp;°C</td>
        </tr>
        <tr>
          <td>Luftfeuchte:</td>
          <td>{_.round(luftfeuchtigkeit, 0)}%</td>
        </tr>
      </tbody>
    </table>
  );
}
