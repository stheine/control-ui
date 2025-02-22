import _           from 'lodash';
import React, {
  useContext,
} from 'react';

// import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Play        from '../../svg/sargam/Play.jsx';
import Value       from '../Value/Value.jsx';

export default function Dreame() {
  const {messages, mqttClient} = useContext(MqttContext);

  if(!_.isEmpty(messages)) {
    // console.log('Dreame', {messages: _.pickBy(messages, (message, topic) => topic.startsWith('valetudo/dreame'))});
  }

  const level         = messages['valetudo/dreame-d9/BatteryStateAttribute/level'] || 999;
  const status        = messages['valetudo/dreame-d9/StatusStateAttribute/status'] || 'Unknown';
  const error         = messages['valetudo/dreame-d9/StatusStateAttribute/error'];
  const errorSeverity = error?.severity.kind || 'none';

  let akkuBackgroundColor;
  let statusBackgroundColor;

  if(level < 40) {
    akkuBackgroundColor = '#ff0000';
  } else if(level < 80) {
    akkuBackgroundColor = '#ffff00';
  }

  switch(status) {
    case 'docked':
      break;

    case 'error':
      statusBackgroundColor = '#ff0000';
      break;

    default:
      statusBackgroundColor = '#ffff00';
      break;
  }

  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2}>Dumbo</th>
        </tr>
        <tr>
          <td>Status:</td>
          <Value
            backgroundColor={statusBackgroundColor}
            value={status}
          />
        </tr>
        <tr>
          <td>Akku:</td>
          <Value
            backgroundColor={akkuBackgroundColor}
            className='digitalism'
            value={level}
            unit='%'
            unitOn='bottom'
          />
        </tr>
        {errorSeverity !== 'none' ?
          <tr>
            <td>Fehler:</td>
            <td>{error.message}</td>
          </tr> :
          null}
        <tr>
          <td colSpan={2}>
            <div style={{width: '100px'}}>
              <Play
                dark={true}
                onClick={async() =>
                  await mqttClient.publishAsync('valetudo/dreame-d9/BasicControlCapability/operation/set', 'START')}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
