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

// eslint-disable-next-line no-underscore-dangle
const _messages   = {};
const setMessages = {};

export default function Fenster() {
  // console.log('Fenster');

  for(const topic of topics) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [_message, setMessage] = useState();

    _messages[topic]   = _message;
    setMessages[topic] = setMessage;
  }

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) => setMessages[topic](message)}),
    [mqttClient]);

  // console.log({_messages});

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
