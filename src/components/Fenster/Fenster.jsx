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
  'Zigbee/FensterSensor Toilette',
  'Zigbee/FensterSensor Kinderbad',
  'Zigbee/FensterSensor Badezimmer',
  'Zigbee/FensterSensor Büro',
  'Zigbee/FensterSensor Garage',
  'Zigbee/FensterSensor Sonoff 1',
];

export default function Fenster() {
  const [_messages, setMessages] = useState({});

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) =>
    setMessages(prevMessages => ({...prevMessages, [topic]: message}))}), [mqttClient]);

  // console.log('Fenster', {_messages});

  return (
    <table>
      <tbody>
        {_.map(topics, topic => {
          const contact = _messages[topic]?.contact;
          const label   = topic.replace(/^[^ ]* /, '');

          return (
            <tr key={topic}>
              <td>
                <span
                  style={{
                    margin: '2px',
                    padding: '1px 5px 1px 5px',
                    ...contact ? {color: '#33ff33'} : {backgroundColor: '#ff0000'},
                  }}
                >
                  {label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
