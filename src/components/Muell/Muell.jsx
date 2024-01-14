import _           from 'lodash';
import React, {
  useContext,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

export default function Muell() {
  const {messages} = useContext(MqttContext);

  const siteConfig = _.first(mqttConfig);
  const message = messages[siteConfig.topic];

  // console.log('Muell', {message});

  if(!message?.length) {
    return;
  }

  return (
    <table>
      <tbody>

        <tr>
          <td>
            <span
              style={{
                fontSize: '40%',
                backgroundColor: '#ff0000',
              }}
            >
              {_.map(message, 'summary')}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
