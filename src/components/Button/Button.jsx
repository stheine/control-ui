import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

export default function Button(props) {
  const {type} = props;

  const topic = `control-io/button${type}/STATE`;

  // console.log('Button');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient, topic]);

  if(!_.isNil(_message)) {
    // console.log('Button', {topic, _message});
  }

  const state = _message;

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td style={{whiteSpace: 'nowrap'}}>Button {type}:</td>
          <td>{state}</td>
        </tr>
      </tbody>
    </table>
  );
}
