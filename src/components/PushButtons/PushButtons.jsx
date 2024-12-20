import _           from 'lodash';
import React, {
  useContext,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Button      from '../../svg/Button.jsx';

export default function PushButtons() {
  const {messages} = useContext(MqttContext);

  if(!_.isEmpty(messages)) {
    // console.log('PushButtons', {messages});
  }

  return (
    <table>
      <tbody>
        <tr>
          {_.map(mqttConfig, config => {
            const label = config.topic.split('/')[1];

            return (
              <td key={label}>
                <Button dark={true} pushed={Boolean(messages[config.topic])} />
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}
