import _           from 'lodash';
import React, {
  useContext,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Led         from '../../svg/Led.jsx';

export default function Leds() {
  const {messages, mqttClient} = useContext(MqttContext);

  if(!_.isEmpty(messages)) {
    // console.log('Leds', {messages});
  }

  return (
    <table>
      <tbody>
        <tr>
          {_.map(mqttConfig, config => {
            const led   = config.topic.split('/')[1];
            const color = led.replace(/^led/, '').toLowerCase();

            return (
              <td key={led}>
                <Led
                  color={color}
                  dark={true}
                  lit={Boolean(messages[config.topic])}
                  onClick={async() =>
                    await mqttClient.publishAsync(`control-io/cmnd/${led}`, messages[config.topic] ? '0' : '1')}
                />
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}
//            <tr key={led} onClick={async() =>
//                await mqttClient.publishAsync(`control-io/cmnd/${led}`, state ? '0' : '1')}>
//              <td style={{whiteSpace: 'nowrap'}}>{led}:</td>
//              <td>{state}</td>
//            </tr>
