/* eslint-disable object-property-newline */

import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Led               from '../../svg/Led.jsx';

const topics = [
  'control-io/ledRed/STATE',
  'control-io/ledWhite/STATE',
];

export default function Leds() {
  const mqttClient = useContext(MqttClientContext);

  const [_messages, setMessages] = useState({'control-io/ledRed/STATE': 0, 'control-io/ledWhite/STATE': 0});

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) =>
    setMessages(prevMessages => ({...prevMessages, [topic]: message}))}), [mqttClient]);

  if(!_.isEmpty(_messages)) {
    // console.log('Leds', {_messages});
  }

  return (
    <table>
      <tbody>
        <tr>
          {_.map(_messages, (state, topic) => {
            const led   = topic.split('/')[1];
            const color = led.replace(/^led/, '').toLowerCase();

            return (
              <td key={led}>
                <Led
                  color={color}
                  dark={true}
                  lit={Boolean(state)}
                  onClick={() => mqttClient.publish(`control-io/cmnd/${led}`, state ? '0' : '1')}
                />
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}
//            <tr key={led} onClick={() => mqttClient.publish(`control-io/cmnd/${led}`, state ? '0' : '1')}>
//              <td style={{whiteSpace: 'nowrap'}}>{led}:</td>
//              <td>{state}</td>
//            </tr>
