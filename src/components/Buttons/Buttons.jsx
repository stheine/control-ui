/* eslint-disable object-property-newline */

import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Button            from '../../svg/Button.jsx';

const topics = [
  'control-io/buttonUpper/STATE',
  'control-io/buttonLower/STATE',
];

export default function Buttons() {
  const mqttClient = useContext(MqttClientContext);

  // console.log('Buttons');

  const [_messages, setMessages] = useState({});

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) =>
    setMessages(prevMessages => ({...prevMessages, [topic]: message}))}), [mqttClient]);


  if(!_.isEmpty(_messages)) {
    // console.log('Button', {topic, _message});
  }

  return (
    <table>
      <tbody>
        <tr>
          {_.map(_messages, (state, topic) => {
            const label = topic.split('/')[1];

            return (
              <td key={label}>
                <Button dark={true} pushed={Boolean(state)} />
              </td>
            );
          })}
        </tr>

      </tbody>
    </table>
  );
}
