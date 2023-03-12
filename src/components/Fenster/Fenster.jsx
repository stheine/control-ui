import _           from 'lodash';
import React, {
  useContext,
  useMemo,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

export default function Fenster() {
  const {messages} = useContext(MqttContext);

  const controlClient = useMemo(() => window.screen.height === 600, []);

  // console.log('Fenster', {_messages});

  return (
    <table>
      <tbody>
        {_.map(mqttConfig, config => {
          if(controlClient && config.topic === 'Zigbee/FensterSensor Sonoff 1') {
            return;
          }

          const contact = messages[config.topic]?.contact;
          const label   = config.topic.replace(/^[^ ]* /, '');

          return (
            <tr key={config.topic}>
              <td>
                <span
                  style={{
                    margin: '2px',
                    padding: '1px 5px 1px 5px',
                    ...contact ? {color: '#33ff33'} : {backgroundColor: '#ff0000'},
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
