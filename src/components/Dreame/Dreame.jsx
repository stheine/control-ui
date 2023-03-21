import _           from 'lodash';
import React, {
  useContext,
} from 'react';

// import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

export default function Dreame() {
  const {messages} = useContext(MqttContext);

  if(!_.isEmpty(messages)) {
    // console.log('Dreame', {messages: _.pickBy(messages, (message, topic) => topic.startsWith('valetudo/dreame'))});
  }

  const level         = messages['valetudo/dreame-d9/BatteryStateAttribute/level'] || 999;
  const status        = messages['valetudo/dreame-d9/StatusStateAttribute/status'] || 'Unknown';
  const error         = messages['valetudo/dreame-d9/StatusStateAttribute/error'];
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
