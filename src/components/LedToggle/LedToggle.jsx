import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

export default function LedToggle(props) {
  const {color} = props;

  const topic = `control-io/led${color}/STATE`;

  // console.log('LedToggle');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient, topic]);

  if(!_.isNil(_message)) {
    // console.log('LedToggle', {topic, _message});
  }

  const state = _message;

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr onClick={() => mqttClient.publish(`control-io/cmnd/led${color}`, state ? '0' : '1')}>
          <td style={{whiteSpace: 'nowrap'}}>LED {color}:</td>
          <td>{state}</td>
        </tr>
      </tbody>
    </table>
  );
}
