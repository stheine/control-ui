import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

export default function Display() {
  const topic = `control-io/display/STATE`;

  // console.log('Display');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient, topic]);

  if(!_.isNil(_message)) {
    // console.log('Display', {topic, _message});
  }

  const state = _message;

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr onClick={() => mqttClient.publish(`control-io/cmnd/display`, state ? '0' : '1')}>
          <td style={{whiteSpace: 'nowrap'}}>Display:</td>
          <td>{state}</td>
        </tr>
      </tbody>
    </table>
  );
}
