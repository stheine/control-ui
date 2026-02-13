import _           from 'lodash';
import React, {
  useContext,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

export default function Fenster() {
  const {controlClient} = useContext(AppContext);
  const {messages}      = useContext(MqttContext);

  // console.log('Fenster', {_messages});

  return (
    <table>
      <tbody>
        {_.map(mqttConfig, config => {
          if(controlClient && config.topic === 'Zigbee/FensterSensor Test') {
            return;
          }

          const contact = messages[config.topic]?.contact;
          const label   = config.topic.replace(/^[^ ]* /, '');

          // console.log('Fenster', {label, contact});

          return (
            <tr key={config.topic}>
              <td>
                <span
                  style={{
                    margin: '2px',
                    padding: '1px 5px 1px 5px',
                    ...contact ? {color: '#33ff33'} : {backgroundColor: '#ff0000', borderRadius: '5px'},
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
