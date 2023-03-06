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
  'valetudo/dreame-d9/BatteryStateAttribute/level',
  'valetudo/dreame-d9/StatusStateAttribute/status',
//  'valetudo/dreame-d9/StatusStateAttribute/detail',
  'valetudo/dreame-d9/StatusStateAttribute/error',
];

export default function Dreame() {
  const mqttClient = useContext(MqttClientContext);

  // console.log('Dreame');

  const [_messages, setMessages] = useState({});

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) =>
    setMessages(prevMessages => ({...prevMessages, [topic]: message}))}), [mqttClient]);

  if(!_.isEmpty(_messages)) {
    // console.log('Dreame', {_messages});
  }

  const level         = _messages['valetudo/dreame-d9/BatteryStateAttribute/level'] || 999;
  const status        = _messages['valetudo/dreame-d9/StatusStateAttribute/status'] || 'Unknown';
  const error         = _messages['valetudo/dreame-d9/StatusStateAttribute/error'];
  const errorSeverity = error?.severity.kind || 'none';

  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2}>Dumbo</th>
        </tr>
        <tr>
          <td>Status:</td>
          <td>{status}</td>
        </tr>
        <tr>
          <td>Akku:</td>
          <td>{level}%</td>
        </tr>
        {errorSeverity !== 'none' ?
          <tr>
            <td>Fehler:</td>
            <td>{error.message}</td>
          </tr> :
          null}
      </tbody>
    </table>
  );
}
