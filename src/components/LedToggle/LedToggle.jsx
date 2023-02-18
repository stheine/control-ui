/* eslint-disable object-property-newline */

import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topics = [
  'control-io/ledRed/STATE',
  'control-io/ledWhite/STATE',
];

export default function LedToggle() {
  const mqttClient = useContext(MqttClientContext);

  const [_messages, setMessages] = useState({'control-io/ledRed/STATE': 0, 'control-io/ledWhite/STATE': 0});

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) =>
    setMessages(prevMessages => ({...prevMessages, [topic]: message}))}), [mqttClient]);

  console.log('LedToggle', {_messages});

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        {_.map(_messages, (state, topic) => {
          console.log({topic});
          const led = topic.split('/')[1];

          return (
            <tr key={led} onClick={() => mqttClient.publish(`control-io/cmnd/${led}`, state ? '0' : '1')}>
              <td style={{whiteSpace: 'nowrap'}}>{led}:</td>
              <td>{state}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
